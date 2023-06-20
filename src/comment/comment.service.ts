import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async getCommentByPostId() {
    return 'get';
  }

  async addComment() {
    return 'add';
  }

  async deleteComment() {
    return 'del';
  }
}
