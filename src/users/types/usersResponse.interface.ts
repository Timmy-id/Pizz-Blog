/* eslint-disable prettier/prettier */
import { UserType } from './users.type';

export interface IUserResponse{
  user: UserType & { token: string };
}