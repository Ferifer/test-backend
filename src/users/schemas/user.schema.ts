import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @ApiProperty({
    example: '8104f19c-a2d8-40f7-9a0b-12f4c6a4b80a',
    description: 'The ID of the user',
  })
  @Prop({
    required: true,
    index: { unique: true },
    default: () => randomUUID(),
  })
  userId: string;

  @ApiProperty({
    description: 'The name of the user',
  })
  @Prop({ required: true, trim: true, lowercase: true })
  name: string;

  @ApiProperty({
    description: 'The username of the user',
  })
  @Prop({ required: true, trim: true, lowercase: true })
  username: string;

  @ApiProperty({
    description: 'The email of the user',
  })
  @Prop({
    required: true,
    index: { unique: true },
    lowercase: true,
  })
  email: string;

  @ApiProperty({
    description: 'The token of the user',
  })
  @Prop({
    required: false,
    index: { unique: true },
  })
  accessToken: string;

  @IsString()
  @Prop({ unique: true, required: true })
  phoneNumber: string;

  @ApiProperty({
    example: '123',
    description: 'The password of the user',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    example: 'M/F',
    description: 'The Gender of the user',
  })
  @Prop({ required: false })
  gender: string;

  @ApiProperty({
    example: 'Aries',
    description: 'The Horoscope of the user',
  })
  @Prop({ required: false })
  horoscope: string;

  @ApiProperty({
    example: 'Aries',
    description: 'The Zodiac of the user',
  })
  @Prop({ required: false })
  zodiac: string;

  @ApiProperty({
    example: '56',
    description: 'The Weight of the user',
  })
  @Prop({ required: false })
  weight: string;

  @ApiProperty({
    example: '192',
    description: 'The Height of the user',
  })
  @Prop({ required: false })
  height: string;

  @ApiProperty({
    example: '28-05-2024',
    description: 'The Birthday of the user',
  })
  @Prop({ required: false })
  birthday: Date;

  @IsDate()
  @Prop()
  createdAt: Date;

  @IsDate()
  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
