import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async getCommentByPostId() {
    const comments = await this.prisma.comment.findMany({
      where: {
        postId: 6,
      },
    });
    return comments;
  }

  async addComment(data: CommentDto) {
    const { description, userId, postId } = data;
    const comment = await this.prisma.comment.create({
      data: {
        description,
        userId,
        postId,
      },
    });
    return comment;
  }

  async deleteComment(commentId: number) {
    const deleted = await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
      select: {
        id: true,
      },
    });

    return deleted;
  }
}
