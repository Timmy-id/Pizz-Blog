/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { CreateUserDto } from '@/users/dto/createUser.dto';
import { LoginUserDto } from '@/users/dto/loginUser.dto';
import {
  ICreateUserResponse,
  IUserResponse,
} from '@/users/types/usersResponse.interface';
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ICreateUserResponse> {
    return await this.authService.Register(createUserDto);
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<IUserResponse> {
    return await this.authService.loginUser(loginUserDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    return await this.authService.verifyEmail(token, res);
  }
}
