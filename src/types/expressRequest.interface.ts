/* eslint-disable prettier/prettier */
import { UsersEntity } from '../users/users.entity';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: UsersEntity | null;
}