import {
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export const confirmUserMatch = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    const tokenUsername = request.user['username'];
    const paramUsername = request.params.user;

    if (tokenUsername.toLowerCase() !== paramUsername.toLowerCase()) {
      throw new ForbiddenException('Access is forbidden');
    }
    return paramUsername;
  },
);
