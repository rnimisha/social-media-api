import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFollowing(username: string) {
    const followings = await this.prisma.follow.findMany({
      where: {
        followerUser: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      },
      include: {
        followingUser: {
          select: {
            id: true,
            username: true,
            profilePic: true,
            name: true,
          },
        },
      },
    });

    return followings;
  }

  getAllFollowers() {
    return 'followers';
  }

  async followUser(): Promise<{ msg: string }> {
    await this.prisma.follow.create({
      data: {
        followerId: 7,
        followingId: 8,
      },
    });
    return { msg: 'User followed successfully' };
  }

  async unfollowUser(): Promise<{ msg: string }> {
    await this.prisma.follow.delete({
      where: {
        id: 1,
      },
    });
    return { msg: 'User unfollowed successfully' };
  }
}
