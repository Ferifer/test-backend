// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { title } from 'case';
@Injectable()
export class TokenAccessGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    if (!authorization) {
      throw new ForbiddenException('Expected authorization');
    }

    const token = authorization.replace('Bearer', ' ').trim();
    try {
      const payload = await this.jwtService.verifyAsync(token);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      const { id } = payload;
      if (!id) {
        throw new ForbiddenException('Expected Token Type');
      }

      request['user_id'] = id;
    } catch (error: any) {
      if (error && error.message) throw new UnauthorizedException(title(error.message));
      throw new UnauthorizedException('incorrect credential');
    }

    return true;
  }
}
