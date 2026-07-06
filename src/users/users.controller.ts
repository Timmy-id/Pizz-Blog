/* eslint-disable prettier/prettier */
import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUserResponse } from './types/usersResponse.interface';
import { AuthRequest } from '../types/expressRequest.interface';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    getCurrentUser(@Req() req: AuthRequest): IUserResponse {
        return this.usersService.generateUserResponse(req.user!)
    }
}
