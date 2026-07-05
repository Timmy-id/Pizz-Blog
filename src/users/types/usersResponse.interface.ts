/* eslint-disable prettier/prettier */
import { IUser } from './users.type';

export interface IUserResponse{
  user: IUser & { token: string };
}