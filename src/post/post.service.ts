import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto';
import { CreatePostResType } from './types';
import { PostType } from './types/post.types';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
  ) {}

  //----------------- Get All Post of the user--------------------------
  async getSingleUserPost(username: string): Promise<PostType[]> {
    await this.profileService.checkUserExist(username);
    const posts = await this.getMultipleUserPost([username]);
    if (posts.length === 0)
      throw new NotFoundException('User does not have post');
    return posts;
  }

  //----------------- Get single post--------------------------
  async getPostByPostId(postId: number): Promise<PostType> {
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        images: true,
        likes: true,
        comments: true,
      },
    });

    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  //----------------- Create New Post--------------------------
  async addNewPost(
    userId: number,
    data: CreatePostDto,
    images: string[],
  ): Promise<CreatePostResType> {
    const newPost = await this.prisma.post.create({
      data: {
        description: data.description,
        userId: userId,
        images: {
          create: images.map((basename) => ({ basename })),
        },
      },
      include: {
        images: true,
      },
    });

    return newPost;
  }

  //----------------- Create Single post--------------------------
  async deleteSinglePostById(postId: number): Promise<{ id: number }> {
    const findPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (!findPost) throw new NotFoundException('Post not found');

    const post = await this.prisma.post.delete({
      where: {
        id: postId,
      },
      select: {
        id: true,
      },
    });

    return post;
  }

  //------------- Get post of username in list--------------------
  async getMultipleUserPost(username: string[]): Promise<PostType[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        author: {
          username: {
            in: username,
            mode: 'insensitive',
          },
        },
      },
      include: {
        images: true,
        likes: true,
        comments: true,
      },
    });

    const postsWithImagePath = posts.map((post) => ({
      ...post,
      images: post.images.map((image) => ({
        ...image,
        basename: `./uploads/posts/${image.basename}`,
      })),
    }));

    return postsWithImagePath;
  }

  async checkPostExists(postId: number): Promise<boolean> {
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException('Post not found');
    return true;
  }
}
