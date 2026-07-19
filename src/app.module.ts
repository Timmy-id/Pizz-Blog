/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';
import { TypeOrmModule } from './datasource/typeorm.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [TypeOrmModule, TagsModule, UsersModule, AuthModule, ArticleModule, ProfilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
