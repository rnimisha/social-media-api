import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FollowerType, FollowingType } from './types';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFollowing(username: string): Promise<FollowingType[]> {
    const followings = await this.prisma.follow.findMany({
      where: {
        followerUser: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      },
      select: {
        id: true,
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

  async getAllFollowers(username: string): Promise<FollowerType[]> {
    const followers = await this.prisma.follow.findMany({
      where: {
        followingUser: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      },
      select: {
        id: true,
        followerUser: {
          select: {
            id: true,
            username: true,
            profilePic: true,
            name: true,
          },
        },
      },
    });

    return followers;
  }

  async followUser(): Promise<{ msg: string }> {
    await this.prisma.follow.create({
      data: {
        followerId: 7,
        followingId: 9,
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
