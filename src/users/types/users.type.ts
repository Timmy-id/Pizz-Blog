/* eslint-disable prettier/prettier */
import { UsersEntity } from '../users.entity';

export type IUser = Omit<UsersEntity, 'hashPassword'>;