import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto';
import { CreatePostResType } from './types';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  //----------------- Get All Post--------------------------
  async getAllPost() {
    const posts = await this.prisma.post.findMany({
      include: {
        images: true,
        likes: true,
      },
    });
    return posts;
  }

  getPostById() {
    return 'post';
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

  updatePostById() {
    return 'updated';
  }

  deleteSinglePostById() {
    return 'deleted';
  }
}
