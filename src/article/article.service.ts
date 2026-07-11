/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UsersEntity } from '@/users/users.entity';
import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>
) {}

  async createArticle(user: UsersEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    const article = new ArticleEntity();

    Object.assign(article, createArticleDto)

    if (!article.tagList) {
        article.tagList = []
    }

    article.slug = 'slug-test'
    article.author = user;

    return await this.articleRepository.save(article)
  }
}
