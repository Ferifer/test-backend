import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { UserId } from './current-user.decorator';
import { LoginResponse } from './dto/login-response.dto';
import { TokenAccessGuard } from './guards/jwt-auth.guard';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }): Promise<LoginResponse> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      // Handle invalid credentials
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(TokenAccessGuard)
  @Get('getProfile')
  async getProfile(@UserId() userId: string): Promise<any> {
    return await this.authService.getProfile(userId);
  }

  @Patch('updateProfile')
  @ApiOperation({
    description: 'Update a profile.',
  })
  @ApiOkResponse({
    description: 'The user was successfully update profile.',
    type: User,
  })
  @UseGuards(TokenAccessGuard)
  async update(@UserId() userId: string, @Body() updateDto: UpdateUserDto): Promise<any> {
    return this.authService.updateProfile(userId, updateDto);
  }
}
