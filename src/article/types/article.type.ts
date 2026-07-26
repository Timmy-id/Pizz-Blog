/* eslint-disable prettier/prettier */
import { ArticleEntity } from '../article.entity';

export type Article = Omit<ArticleEntity, 'updateTimestamp'>;
