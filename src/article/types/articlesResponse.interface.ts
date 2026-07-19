/* eslint-disable prettier/prettier */
import { Article } from './article.type';

export interface IArticlesResponse {
  articles: Article[];
  articlesCount: number;
}
