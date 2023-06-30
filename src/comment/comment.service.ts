import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommentDto } from './dto';
import { CommentType } from './types';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postService: PostService,
  ) {}

  async getCommentByPostId(postId: number): Promise<CommentType[]> {
    await this.postService.checkPostExists(postId);
    const comments = await this.prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        commentBy: {
          select: {
            name: true,
            username: true,
            profilePic: true,
          },
        },
      },
    });
    return comments;
  }

  async addComment(data: CommentDto): Promise<CommentType> {
    const { description, userId, postId } = data;

    await this.postService.checkPostExists(postId);

    const comment = await this.prisma.comment.create({
      data: {
        description,
        userId,
        postId,
      },
    });
    return comment;
  }

  async deleteComment(commentId: number): Promise<{ id: number }> {
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
