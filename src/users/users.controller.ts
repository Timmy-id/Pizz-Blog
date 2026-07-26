/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUserResponse } from './types/usersResponse.interface';
import { User } from './decorators/users.decorator';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@User() user): Promise<IUserResponse> {
    return await this.usersService.generateUserResponse(user!);
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') userId: string,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    return this.usersService.updateUser(userId, updateUserDto);
  }
}
