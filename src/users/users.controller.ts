/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUserResponse } from './types/usersResponse.interface';
import { User } from './decorators/users.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    getCurrentUser(@User() user): IUserResponse {
        return this.usersService.generateUserResponse(user!)
    }
}
