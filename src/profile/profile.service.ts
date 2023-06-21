import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        profilePic: true,
        coverPic: true,
        followers: true,
        followings: true,
        posts: true,
      },
    });

    const { followings, followers, posts, ...others } = user;
    const followingCount = followings.length;
    const followerCount = followers.length;
    const postCount = posts.length;
    return { ...others, followerCount, followingCount, postCount };
  }

  updateUserProfile() {
    return 'user';
  }

  deleteUserProfile() {
    return 'user';
  }
}
