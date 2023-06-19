import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const getCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    return request.user['sub'];
  },
);
