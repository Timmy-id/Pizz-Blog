/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { User } from '@/users/decorators/users.decorator';
import { IProfileResponse } from './types/profileResponse.interface';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':username')
  async getProfile(@Param('username') profileUsername: string) {
    return await this.profilesService.getProfile(profileUsername)
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: string,
    @Param('username') followingUsername: string
  ): Promise<IProfileResponse> {
    return await this.profilesService.followProfile(currentUserId, followingUsername)
  }
}
