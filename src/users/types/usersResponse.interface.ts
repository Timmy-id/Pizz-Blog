/* eslint-disable prettier/prettier */
import { UserType } from './users.type';

export interface IUserResponse {
  user: UserType & { accessToken: string };
}

export interface ICreateUserResponse {
  message: string;
}
