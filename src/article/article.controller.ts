/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { User } from '@/users/decorators/users.decorator';
import { UsersEntity } from '@/users/users.entity';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleService } from './article.service';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { IArticleResponse } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { IArticlesResponse } from './types/articlesResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createArticle(@User() user: UsersEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<IArticleResponse> {
    return await this.articleService.createArticle(user, createArticleDto);
  }

  @Get(':slug')
  @UseGuards(AuthGuard)
  async getSingleArticle(@Param('slug') slug: string): Promise<IArticleResponse> {
    return await this.articleService.getSingleArticle(slug)
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@Param('slug') slug: string, @User('id') currentUserId: string) {
    return await this.articleService.deleteArticle(slug, currentUserId)
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  async updateArticle(@Param('slug') slug: string, @User('id') currentUserId: string, @Body('article') updateArticleDto: UpdateArticleDto): Promise<IArticleResponse> {
    return await this.articleService.updateArticle(slug, currentUserId, updateArticleDto)
  }

  @Get()
  async getAllArticles(@User('id') currentUserId: string, @Query() query: any): Promise<IArticlesResponse> {
    return await this.articleService.getAllArticles(currentUserId, query) 
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addToFavoriteArticle(
    @Param('slug') slug: string, @User('id') currentUserId: string
  ): Promise<IArticleResponse> {
    return await this.articleService.addToFavoriteArticle(slug, currentUserId)
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async removeFromFavoriteArticle(
    @Param('slug') slug: string, @User('id') currentUserId: string
  ): Promise<IArticleResponse> {
    return await this.articleService.removeFromFavoriteArticle(slug, currentUserId)
  }
}