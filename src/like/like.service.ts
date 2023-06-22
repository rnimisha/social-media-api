import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LikeUnlikeDto } from './dto';
import { PostService } from '../post/post.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LikeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postService: PostService,
  ) {}
  async likePost(userId: number, data: LikeUnlikeDto): Promise<{ id: number }> {
    try {
      await this.postService.checkPostExists(data.postId);
      const newLike = await this.prisma.like.create({
        data: {
          userId: userId,
          postId: data.postId,
        },
      });
      return { id: newLike.id };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new BadRequestException('The post is already liked');
        }
      } else {
        throw err;
      }
    }
  }

  async unlikePost(
    userId: number,
    data: LikeUnlikeDto,
  ): Promise<{ id: number }> {
    await this.postService.checkPostExists(data.postId);

    const like = await this.prisma.like.findFirst({
      where: {
        userId: userId,
        postId: data.postId,
      },
    });

    if (!like) throw new NotFoundException('Post is not liked yet.');

    const deleted = await this.prisma.like.delete({
      where: {
        id: like.id,
      },
    });

    return { id: deleted.id };
  }
}
