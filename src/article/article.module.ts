import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { UsersEntity } from '@/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UsersEntity])],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
