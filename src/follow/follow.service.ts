import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FollowUserType, FollowerType, FollowingType } from './types';
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

  async unfollowUser(
    currentUser: number,
    userToUnfollow: number,
  ): Promise<{ msg: string }> {
    const followId = await this.findFollowId(currentUser, userToUnfollow);
    await this.prisma.follow.delete({
      where: {
        id: followId,
      },
    });
    return { msg: 'User unfollowed successfully' };
  }

  async getUserToFollow(userId: number): Promise<FollowUserType[]> {
    const users = await this.prisma.user.findMany({
      where: {
        NOT: [
          {
            id: userId,
          },
          {
            followings: {
              some: {
                followerId: userId,
              },
            },
          },
        ],
      },
      take: 5,
      select: {
        id: true,
        username: true,
        profilePic: true,
        name: true,
      },
    });

    return users;
  }

  //--------------helper-------------------------------
  async getFollowingUsernames(username: string): Promise<string[]> {
    const followings = await this.getAllFollowing(username);

    const usernamesOnly = followings.map((item) => item.followingUser.username);
    return usernamesOnly;
  }

  async findFollowId(
    currentUser: number,
    userToUnfollow: number,
  ): Promise<number> {
    const follow = await this.prisma.follow.findFirst({
      where: {
        followerId: currentUser,
        followingId: userToUnfollow,
      },
    });

    return follow.id;
  }
}
