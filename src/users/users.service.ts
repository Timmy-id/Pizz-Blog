/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
} from '@/config';
import { UpdateUserDto } from './dto/updateUser.dto';
import { EmailService } from '@/auth/email.service';
import { JwtService } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { IUserResponse } from './types/usersResponse.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(user: UsersEntity) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email!,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: JWT_ACCESS_SECRET,
      expiresIn: JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: JWT_REFRESH_SECRET,
      expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
    });
    return { accessToken, refreshToken };
  }

  async generateUserResponse(user: UsersEntity): Promise<IUserResponse> {
    const { accessToken } = await this.generateTokens(user);
    if (!user.id) {
      throw new HttpException('User data missing', HttpStatus.BAD_REQUEST);
    }

    return {
      user: {
        ...user,
        accessToken,
      },
    };
  }

  async findByEmail(email: string): Promise<UsersEntity | null> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<UsersEntity | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findByUsername(username: string): Promise<UsersEntity | null> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(user, updateUserDto);
    await this.usersRepository.save(user);
    return this.generateUserResponse(user);
  }
}
