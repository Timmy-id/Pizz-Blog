/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { CreateUserDto } from '@/users/dto/createUser.dto';
import { LoginUserDto } from '@/users/dto/loginUser.dto';
import { IUserResponse } from '@/users/types/usersResponse.interface';
import { UsersService } from '@/users/users.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<IUserResponse> {
    return await this.usersService.createUser(createUserDto);
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<IUserResponse> {
    return await this.usersService.loginUser(loginUserDto);
  }
}
