/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JWT_ACCESS_SECRET } from '@/config';
import { AuthRequest } from '../../types/expressRequest.interface';
import { UsersService } from '../../users/users.service';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UsersEntity } from '../../users/users.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: AuthRequest, _res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = new UsersEntity();
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = verify(token, JWT_ACCESS_SECRET as string);
      const user = await this.usersService.findById(
        (decode as { id: string }).id,
      );

      if (!user) {
        req.user = null;
        next();
        return;
      }

      req.user = user;
      next();
      return;
    } catch (error) {
      req.user = null;
      next();
      return;
    }
  }
}
