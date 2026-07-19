/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':username')
  async getProfile(@Param('username') profileUsername: string) {
    return await this.profilesService.getProfile(profileUsername)
  }
}
