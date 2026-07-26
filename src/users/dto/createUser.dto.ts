/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '12345678', minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
