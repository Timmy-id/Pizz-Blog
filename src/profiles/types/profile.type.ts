/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { UserType } from '@/users/types/users.type';

export type ProfileType = UserType & { following: boolean };
