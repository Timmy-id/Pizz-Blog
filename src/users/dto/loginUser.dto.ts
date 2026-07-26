/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '12345678', minLength: 8 })
  @IsNotEmpty()
  readonly password: string;
}
