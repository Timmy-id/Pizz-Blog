/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '@/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
