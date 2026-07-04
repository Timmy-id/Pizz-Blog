/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TagsEntity } from './tags.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(TagsEntity) private readonly tagRepository: Repository<TagsEntity>) {}
  async getAll() {
    const allTags = await this.tagRepository.find()
    const tags: string[] = allTags.map(tag => tag.name)
    return { tags };
  }
}
