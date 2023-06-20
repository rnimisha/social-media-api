import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  getAllPost() {
    return 'posts';
  }

  getPostById() {
    return 'post';
  }

  addNewPost() {
    return 'added';
  }

  updatePostById() {
    return 'updated';
  }

  deleteSinglePostById() {
    return 'deleted';
  }
}
