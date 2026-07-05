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
import { compare } from 'bcryptjs'

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

        const savedUser = await this.usersRepository.save(newUser)
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

    async comparePassword(user: UsersEntity, password: string): Promise<boolean> {
        return await compare(password, user.password)
    }

    async loginUser(loginUserDto: LoginUserDto): Promise<IUserResponse> {
        const user = await this.findByEmail(loginUserDto.email)

        if (!user) {
            throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST)
        }

        const isPasswordValid = await this.comparePassword(user, loginUserDto.password)

        if (!isPasswordValid) {
            throw new HttpException("Invalid credentials", HttpStatus.BAD_REQUEST)
        }

        return this.generateUserResponse(user)
    }
}