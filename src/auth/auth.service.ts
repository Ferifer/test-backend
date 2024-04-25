import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { formatFromDate, formatToDate } from 'src/common/util/dateFormatting';
import { comparePasswords } from 'src/common/util/security';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './dto/jwt-payload.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> | null {
    const user = await this.usersService.findByEmail(email);
    const passwordIsValid = comparePasswords(pass, user.password);
    if (passwordIsValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId, email } = user;
      return { userId, email };
    }
    return null;
  }

  async verify(token: string): Promise<User> {
    const decoded: JwtPayload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const user = await this.usersService.findByEmail(decoded.email);
    return user;
  }

  async login(user: User): Promise<any> {
    const userExist = await this.userModel.findOne({ email: user.email }).lean();
    if (!userExist) {
      throw new NotFoundException('User Not Found');
    }
    const payload = { id: userExist.userId };

    const accessToken = await this.jwtService.sign(payload);

    await this.userModel.updateOne({ userId: userExist.userId }, { accessToken: accessToken });

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: {
        name: userExist.name,
        email: userExist.email,
        accessToken: accessToken,
      },
    };
  }

  async getProfile(userId: string): Promise<any> {
    const userExist = await this.userModel.findOne({ userId: userId });

    if (!userExist) {
      throw new NotFoundException('User Not Found');
    }

    const data = {
      userId: userExist.userId,
      name: userExist.name,
      username: userExist.username,
      email: userExist.email,
      phoneNumber: userExist.phoneNumber ?? '',
      gender: userExist.gender ?? '',
      birthday: userExist.birthday ? formatFromDate(userExist.birthday) : '',
      horoscope: userExist.horoscope ?? '',
      zodiac: userExist.zodiac ?? '',
      height: userExist.height ?? '',
      weight: userExist.weight ?? '',
    };
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: data,
    };
  }
  async updateProfile(userId: string, updateDto: UpdateUserDto): Promise<any> {
    const userExist = await this.userModel.findOne({ userId: userId });

    if (!userExist) {
      throw new NotFoundException('User Not Found');
    }

    // Parse the birthday string into a Date object
    const birthdayDate = formatToDate(updateDto.birthday, 'DD-MM-YYYY');
    await this.userModel.updateOne(
      { userId: userExist.userId },
      {
        name: updateDto.name,
        username: updateDto.username,
        email: updateDto.email,
        phoneNumber: updateDto.phoneNumber,
        gender: updateDto.gender,
        birthday: birthdayDate,
        horoscope: updateDto.horoscope,
        zodiac: updateDto.zodiac,
        height: updateDto.height,
        weight: updateDto.weight,
      },
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: null,
    };
  }
}
