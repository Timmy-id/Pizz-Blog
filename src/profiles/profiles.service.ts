/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { UsersEntity } from '@/users/users.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProfileResponse } from './types/profileResponse.interface';
import { ProfileType } from './types/profile.type';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async getProfile(profileUsername: string): Promise<IProfileResponse> {
    const profile = await this.userRepository.findOne({
        where: { username: profileUsername }
    })

    if(!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND)
    }

    delete profile?.password
    delete profile?.email

    return this.generateProfileResponse(profile)
  }

  generateProfileResponse(profile: UsersEntity): IProfileResponse {
    const profileResponse: ProfileType = {
      ...profile,
      following: false,
    }

    return { profile: profileResponse }
  }
}
