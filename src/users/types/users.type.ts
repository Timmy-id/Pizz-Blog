/* eslint-disable prettier/prettier */
import { UsersEntity } from '../users.entity';

export type UserType = Omit<UsersEntity, 'password'>;
