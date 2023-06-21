import { Injectable, NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
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

  updateUserProfile(username: string) {
    return 'user';
  }

  async deleteUserProfile(username: string) {
    const userId = await this.checkUserExist(username);
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return { msg: 'user deleted successfully' };
  }

  //---------------------helper-----------------------------
  async checkUserExist(username: string): Promise<number> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user.id;
  }
}
