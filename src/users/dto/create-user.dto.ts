import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The name of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'The username of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The Phone Number of the user',
  })
  @Optional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'The Birthday of the user',
  })
  @Optional()
  @IsString()
  birthday?: string;

  @ApiProperty({
    description: 'The Gender of the user',
  })
  @Optional()
  @IsString()
  gender?: string;

  @ApiProperty({
    description: 'The Horoscope of the user',
  })
  @Optional()
  @IsString()
  horoscope?: string;

  @ApiProperty({
    description: 'The Zodiac of the user',
  })
  @Optional()
  @IsString()
  zodiac?: string;

  @ApiProperty({
    description: 'The Height of the user',
  })
  @Optional()
  @IsNumber()
  height?: string;

  @ApiProperty({
    description: 'The Weight of the user',
  })
  @Optional()
  @IsNumber()
  weight?: string;
}
