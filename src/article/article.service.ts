/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { IArticlesResponse } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>
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

  async getAllArticles(currentUserId: string, query: any): Promise<IArticlesResponse> {
    const queryBuilder = this.articleRepository
        .createQueryBuilder('articles')
        .leftJoinAndSelect('articles.author', 'author')

    if (query.tag) {
        queryBuilder.andWhere(':tag = ANY(articles.tagList)', {
            tag: query.tag
        })
    }

    if (query.author) {
        const author = await this.userRepository.findOne({
            where: { username: query.author }
        })

        queryBuilder.andWhere('articles.author = :id', {
            id: author?.id
        })
    }

    if (query.favorited) {
        const author = await this.userRepository.findOne({
            where: { username: query.favorited },
            relations: { favorites: true }
        })

        if (!author || author.favorites.length === 0) {
            return { articles: [], articlesCount: 0 }
        }

        const favoriteIds = author.favorites.map(articles => articles.id)

        queryBuilder.andWhere('articles.id IN (:...ids)', {
            ids: favoriteIds
        })
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC')

    const articlesCount = await queryBuilder.getCount()

    if (query.limit) {
        queryBuilder.limit(query.limit)
    }

    if (query.offset) {
        queryBuilder.offset(query.offset)
    }

    const articles = await queryBuilder.getMany()

    let userFavoriteIds: string[] = []

    if (currentUserId) {
        const currentUser = await this.userRepository.findOne({
            where: { id: currentUserId },
            relations: { favorites: true }
        })

        userFavoriteIds = currentUser ? currentUser.favorites.map(article => article.id) : []
    }

    const articlesWithFavorited = articles.map((article) => {
        const favorited = userFavoriteIds.includes(article.id)
        return { ...article, favorited }
    })

    return { articles: articlesWithFavorited, articlesCount }
  }

  async addToFavoriteArticle(slug: string, currentUserId: string): Promise<IArticleResponse> {
    const user = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: { favorites: true }
    })

    if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    const currentArticle = await this.findArticleBySlug(slug)

    const isNotFavorited = !user.favorites.find((article) => article.slug === currentArticle.slug)
    
    if (isNotFavorited) {
        currentArticle.favoriteCount++
        user.favorites.push(currentArticle)
        await this.articleRepository.save(currentArticle)
        await this.userRepository.save(user)
    }
    
    return this.generateArticleResponse(currentArticle)
  }

  async removeFromFavoriteArticle(slug: string, currentUserId: string): Promise<IArticleResponse> {
     const user = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: { favorites: true }
    })

    if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    const currentArticle = await this.findArticleBySlug(slug)

    const articleIndex = user.favorites.findIndex(article => article.slug === currentArticle.slug)

    if (articleIndex >= 0) {
        currentArticle.favoriteCount--
        user.favorites.splice(articleIndex, 1)
        await this.articleRepository.save(currentArticle)
        await this.userRepository.save(user)
    }

    return this.generateArticleResponse(currentArticle)
  }

  async findArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
        where: { slug },
        relations: { author: true },
        select: {
            author: {
                id: true,
                username: true,
                bio: true,
                image: true
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
