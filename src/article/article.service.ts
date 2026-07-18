/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { UsersEntity } from '@/users/users.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { IArticleResponse } from './types/articleResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>
) {}

  async createArticle(user: UsersEntity, createArticleDto: CreateArticleDto): Promise<IArticleResponse> {
    const article = new ArticleEntity();

    Object.assign(article, createArticleDto)

    if (!article.tagList) {
        article.tagList = []
    }

    article.slug = this.generateSlug(article.title)
    article.author = user;

    const newArticle = await this.articleRepository.save(article)
    return this.generateArticleResponse(newArticle)
  }

  generateSlug(title: string): string {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    return `${slugify(title, { lower: true })}-${id}`
  }

  async getSingleArticle(slug: string): Promise<IArticleResponse> {
    const article = await this.articleRepository.findOne({
        where: { slug },
        relations: { author: true },
        select: {
            author: {
                id: true,
                username: true,
                email: true
            }
        }
    })

    if (!article) {
        throw new HttpException('Artcle Not found', HttpStatus.NOT_FOUND)
    }

    return this.generateArticleResponse(article)
  }

  generateArticleResponse(article: ArticleEntity): IArticleResponse {
    return { article }
  }
}
