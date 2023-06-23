import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { ProfileImageType, ProfileType, UpdateProfileType } from './types';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(username: string): Promise<ProfileType> {
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
        profilePic: true,
        coverPic: true,
        followers: true,
        followings: true,
        posts: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const { followings, followers, posts, ...others } = user;
    const followingCount = followings.length;
    const followerCount = followers.length;
    const postCount = posts.length;
    return { ...others, followerCount, followingCount, postCount };
  }

  async updateUserProfile(
    username: string,
    data: UpdateUserDto,
    images: ProfileImageType,
  ): Promise<UpdateProfileType> {
    const userId = await this.checkUserExist(username);
    const updated = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
        ...images,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        profilePic: true,
        coverPic: true,
        updatedAt: true,
      },
    });
    return updated;
  }

  async deleteUserProfile(username: string): Promise<{ msg: string }> {
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
