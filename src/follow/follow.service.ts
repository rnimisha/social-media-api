import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FollowerType, FollowingType } from './types';
import { FollowReqDto } from './dto';

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

  async followUser(
    userId: number,
    data: FollowReqDto,
  ): Promise<{ msg: string }> {
    await this.prisma.follow.create({
      data: {
        followerId: userId,
        followingId: data.userToFollowId,
      },
    });
    return { msg: 'User followed successfully' };
  }

  async unfollowUser(id: number): Promise<{ msg: string }> {
    await this.prisma.follow.delete({
      where: {
        id: id,
      },
    });
    return { msg: 'User unfollowed successfully' };
  }

  //--------------helper-------------------------------
  async getFollowingUsernames(username: string): Promise<string[]> {
    const followings = await this.getAllFollowing(username);

    const usernamesOnly = followings.map((item) => item.followingUser.username);
    return usernamesOnly;
  }
}
