/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { User } from '@/users/decorators/users.decorator';
import { UsersEntity } from '@/users/users.entity';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleService } from './article.service';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { IArticleResponse } from './types/articleResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createArticle(@User() user: UsersEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<IArticleResponse> {
    return await this.articleService.createArticle(user, createArticleDto);
  }
}
