/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { SignOptions } from 'jsonwebtoken';
import { Response } from 'express';
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  NODE_ENV,
} from '@/config';
import { hash, compare, genSalt } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '@/auth/email.service';
import { UsersEntity } from '@/users/users.entity';
import { CreateUserDto } from '@/users/dto/createUser.dto';
import {
  ICreateUserResponse,
  IUserResponse,
} from '@/users/types/usersResponse.interface';
import { LoginUserDto } from '@/users/dto/loginUser.dto';
import { UsersService } from '@/users/users.service';
import { getVerificationTokenExpiresAt } from '@/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}
  async Register(createUserDto: CreateUserDto): Promise<ICreateUserResponse> {
    const newUser = new UsersEntity();
    Object.assign(newUser, createUserDto);

    const userEmailExist = await this.usersService.findByEmail(
      createUserDto.email,
    );

    const usernameExist = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (userEmailExist || usernameExist) {
      throw new HttpException(
        'Username or Email already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const salt = await genSalt(10);

    const hashPassword = await hash(createUserDto.password, salt);

    const verificationToken: string = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = getVerificationTokenExpiresAt(24);

    await this.usersRepository.save({
      ...newUser,
      password: hashPassword,
      verificationToken,
      verificationTokenExpiresAt,
    });

    void this.emailService.sendVerificationEmail(
      createUserDto.email,
      verificationToken,
    );
    return {
      message: 'Registration successful. Please check your email to verify.',
    };
  }

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

  async logout(userId: string, res: Response) {
    await this.usersRepository.update(userId, { refreshToken: undefined });
    res.clearCookie('refresh_token');
    return { message: 'User logged out successfully' };
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const salt = await genSalt(10);
    const refreshTokenHash = await hash(refreshToken, salt);
    await this.usersRepository.update(userId, {
      refreshToken: refreshTokenHash,
    });
  }

  setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production,',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  async findByVerificationToken(token: string): Promise<UsersEntity | null> {
    const user = await this.usersRepository.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async comparePassword(user: UsersEntity, password: string): Promise<boolean> {
    return compare(password, user.password as string);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<IUserResponse> {
    const user = await this.usersService.findByEmail(loginUserDto.email);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await this.comparePassword(
      user,
      loginUserDto.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (!user.isVerified) {
      throw new HttpException(
        'Please verify your email to continue.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { refreshToken } = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, refreshToken);

    return this.usersService.generateUserResponse(user);
  }

  async verifyEmail(token: string, res: Response) {
    const user = await this.findByVerificationToken(token);

    if (!user) {
      throw new HttpException(
        'Invalid verification token',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      user.verificationTokenExpiresAt &&
      user.verificationTokenExpiresAt < new Date()
    ) {
      throw new HttpException(
        'Verification token expired. Kindly request a new one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.usersRepository.update(user.id, {
      isVerified: true,
      verificationToken: undefined,
      verificationTokenExpiresAt: undefined,
    });

    const { accessToken, refreshToken } = await this.generateTokens(user);

    await this.saveRefreshToken(user.id, refreshToken);
    this.setRefreshTokenCookie(res, refreshToken);

    return {
      message: 'Email verified successfully',
      accessToken,
    };
  }
}
