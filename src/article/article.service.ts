/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import slugify from 'slugify';
import { UsersEntity } from '@/users/users.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { IArticleResponse } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle.dto';

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
    const article = await this.findArticleBySlug(slug)

    return this.generateArticleResponse(article)
  }

  async deleteArticle(slug: string, currentUserId: string): Promise<DeleteResult> {
    const article = await this.findArticleBySlug(slug)

    if (article.author.id !== currentUserId) {
        throw new HttpException('Only the author can delete', HttpStatus.FORBIDDEN)
    }
    
    return await this.articleRepository.delete({ slug })
  }

  async updateArticle(slug: string, currentUserId: string, updateArticleDto: UpdateArticleDto): Promise<IArticleResponse> {
    const article = await this.findArticleBySlug(slug)

    if (article.author.id !== currentUserId) {
        throw new HttpException('Only the author can update this article', HttpStatus.FORBIDDEN)
    }

    if (updateArticleDto.title) {
        article.slug = this.generateSlug(updateArticleDto.title)
    }

    Object.assign(article, updateArticleDto)

    const newArticle = await this.articleRepository.save(article)
    return this.generateArticleResponse(newArticle)
  }

  async findArticleBySlug(slug: string): Promise<ArticleEntity> {
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

    return article
  }

  generateArticleResponse(article: ArticleEntity): IArticleResponse {
    return { article }
  }
}
