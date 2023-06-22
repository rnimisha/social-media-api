import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LikeUnlikeDto } from './dto';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}
  async likePost(userId: number, data: LikeUnlikeDto): Promise<{ id: number }> {
    const newLike = await this.prisma.like.create({
      data: {
        userId: userId,
        postId: data.postId,
      },
    });

    return { id: newLike.id };
  }

  async unlikePost(
    userId: number,
    data: LikeUnlikeDto,
  ): Promise<{ id: number }> {
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
