import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserResponse } from './dto/delete-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { use } from 'passport';
import { encryptPassword } from 'src/common/util/security';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findAll(): Promise<any> {
    const result = await this.userModel.find().select('userId email name ').lean();
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      list: result,
    };
  }

  async findById(userId: string): Promise<any> {
    const user = await this.userModel.findOne({ userId }).lean();
    if (!user) {
      throw new NotFoundException(`User Not Found`);
    }
    const data = {
      userId: user.userId,
      name: user.name,
      username: user.username,
      email: user.email,
    };
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: data,
    };
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).lean();
    if (!user) {
      throw new NotFoundException(`No existe el usuario ${email}`);
    }
    return user;
  }

  async create(user: CreateUserDto): Promise<User> {
    const alreadyExists = await this.userModel.exists({ email: user.email }).lean();
    if (alreadyExists) {
      throw new ConflictException(`User with that email already exists`);
    }
    const passwordHash = await encryptPassword(user.password);
    const userToCreate = {
      ...user,
      userId: randomUUID(),
      password: passwordHash,
      accessToken: null,
    };
    return this.userModel.create(userToCreate);
  }

  async updateById(userId: string, userUpdates: UpdateUserDto): Promise<any> {
    const exists = await this.userModel.exists({ userId: userId }).lean();
    if (!exists) {
      throw new NotFoundException(`User Not Found`);
    }
    const update = await this.userModel
      .findOneAndUpdate({ userId }, userUpdates, {
        new: true,
      })
      .lean();
    return { statusCode: HttpStatus.OK, message: 'Success', data: null };
  }

  async remove(userId: string): Promise<any> {
    const exists = await this.userModel.exists({ userId: userId }).lean();
    if (!exists) {
      throw new NotFoundException(`User Not Found`);
    }
    await this.userModel.deleteOne({ userId }).lean();
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: null,
    };
  }

  async seedUsers(): Promise<void> {
    const usersToSeed: CreateUserDto[] = [
      { name: 'feri', email: 'feri@example.com', password: 'password1', username: 'handoyo' },
      // Add more users as needed
    ];

    for (const userData of usersToSeed) {
      try {
        await this.create(userData);
        console.log(`User seeded: ${userData.email}`);
      } catch (error) {
        console.error(`Error seeding user ${userData.email}: ${error.message}`);
      }
    }

    console.log('User seeding complete.');
  }
}
