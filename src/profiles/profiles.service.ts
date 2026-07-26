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
import { FollowEntity } from './follow.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,

    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(profileUsername: string): Promise<IProfileResponse> {
    const profile = await this.userRepository.findOne({
      where: { username: profileUsername },
    });

    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return this.generateProfileResponse(profile);
  }

  async followProfile(
    currentUserId: string,
    followingUsername: string,
  ): Promise<IProfileResponse> {
    const followingProfile = await this.userRepository.findOne({
      where: { username: followingUsername },
    });

    if (!followingProfile) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === followingProfile.id) {
      throw new HttpException(
        "You can't follow yourself",
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: followingProfile.id,
      },
    });

    if (!follow) {
      const newFollow = new FollowEntity();
      newFollow.followerId = currentUserId;
      newFollow.followingId = followingProfile.id;
      await this.followRepository.save(newFollow);
    }
    const profile = { ...followingProfile, following: true };
    return this.generateProfileResponse(profile);
  }

  generateProfileResponse(profile: UsersEntity): IProfileResponse {
    delete profile?.password;
    delete profile?.email;

    const profileResponse: ProfileType = {
      ...profile,
      following: false,
    };

    return { profile: profileResponse };
  }
}
