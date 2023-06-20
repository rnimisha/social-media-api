import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostImageInterceptorOptions } from './interceptor';
import { basename } from 'path';

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
  @UseInterceptors(FilesInterceptor('images', 4, PostImageInterceptorOptions))
  addNewPost(
    @Body() body: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const filenames = files.map((file) => basename(file.path));
    console.log({ filenames });
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
