/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken'
import { CreateUserDto } from './dto/createUser.dto';
import { UsersEntity } from './users.entity';
import { IUserResponse } from './types/usersResponse.interface';
import { JWT_SECRET } from '@/config';
import { LoginUserDto } from './dto/loginUser.dto';
import { hash, compare, genSalt } from 'bcryptjs'
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>) {}
    async createUser(createUserDto: CreateUserDto): Promise<IUserResponse> {
        const newUser = new UsersEntity()
        Object.assign(newUser, createUserDto)

        const userEmailExist = await this.usersRepository.findOne({
            where: { email: createUserDto.email }
        })

        const usernameExist = await this.usersRepository.findOne({
            where: { username: createUserDto.username }
        })

        if (userEmailExist || usernameExist) {
            throw new HttpException("Username or Email already taken", HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const salt = await genSalt(10)

        const hashPassword = await hash(createUserDto.password, salt)

        const savedUser = await this.usersRepository.save({ ...newUser, password: hashPassword })
        return this.generateUserResponse(savedUser)
    }

    generateToken(user: UsersEntity): string {
        return sign (
            { 
                id: user.id,
                username: user.username,
                email: user.email 
            }, JWT_SECRET as string, { expiresIn: '1h' })
    }

    generateUserResponse(user: UsersEntity): IUserResponse {
        if (!user.id) {
            throw new HttpException("User data missing", HttpStatus.BAD_REQUEST)
        }

        return {
            user: {
                ...user,
                token: this.generateToken(user)
            }
        }
    }

    async findByEmail(email: string): Promise<UsersEntity | null> {
        return await this.usersRepository.findOne({
            where: { email }
        })
    }

    async findById(id: string): Promise<UsersEntity | null> {
        const user = await this.usersRepository.findOne({
            where: {id}
        })

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }

        return user
    }

    async comparePassword(user: UsersEntity, password: string): Promise<boolean> {
        return compare(password, user.password as string)
    }

    async loginUser(loginUserDto: LoginUserDto): Promise<IUserResponse> {
        const user = await this.findByEmail(loginUserDto.email)

        if (!user) {
            throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED)
        }

        const isPasswordValid = await this.comparePassword(user, loginUserDto.password)

        if (!isPasswordValid) {
            throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED)
        }

        const { password, ...result } = user
        void password

        return this.generateUserResponse(result)
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto) {
        const user = await this.findById(userId)

        if (!user) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND)
        }

        Object.assign(user, updateUserDto)
        await this.usersRepository.save(user)
        return this.generateUserResponse(user)
    }
}