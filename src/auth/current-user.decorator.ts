import { ExecutionContext, Headers, createParamDecorator } from '@nestjs/common';

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const { user_id } = ctx.switchToHttp().getRequest();

  return user_id;
});
