/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';
import { TypeOrmModule } from './datasource/typeorm.module';

@Module({
  imports: [TypeOrmModule, TagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
