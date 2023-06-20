import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('')
  getAllPost() {
    return this.postService.getAllPost();
  }

  @Get(':id')
  getPostById() {
    return this.postService.getPostById();
  }

  @Post('')
  addNewPost() {
    return this.postService.addNewPost();
  }

  @Put('')
  updatePostById() {
    return this.postService.updatePostById();
  }

  @Delete('')
  deleteSinglePostById() {
    return this.postService.deleteSinglePostById();
  }
}
