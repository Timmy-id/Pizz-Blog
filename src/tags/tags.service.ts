/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TagsEntity } from './tags.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  private logger = new Logger(TagsService.name);
  constructor(@InjectRepository(TagsEntity) private readonly tagRepository: Repository<TagsEntity>) {}
  async getAll() {
    return await this.tagRepository.find()
  }
}
