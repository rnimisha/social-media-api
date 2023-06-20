import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto';
import { CreatePostResType } from './types';
import { PostType } from './types/post.types';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  //----------------- Get All Post--------------------------
  async getAllPost(): Promise<PostType[]> {
    const posts = await this.prisma.post.findMany({
      include: {
        images: true,
        likes: true,
      },
    });
    return posts;
  }

  async getPostById(postId: number): Promise<PostType> {
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        images: true,
        likes: true,
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
}
