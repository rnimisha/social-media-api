import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostImageInterceptorOptions } from './interceptor';
import { basename } from 'path';
import { CreatePostDto } from './dto';
import { getCurrentUserId } from 'src/common/decorator';
import { CreatePostResType } from './types';
import { PostType } from './types/post.types';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':username')
  getAllUserPost(@Param('username') username: string): Promise<PostType[]> {
    return this.postService.getAllUserPost(username);
  }

  @Get(':username/:postid')
  getPostByPostId(
    @Param('postid', ParseIntPipe) postid: number,
  ): Promise<PostType> {
    return this.postService.getPostByPostId(postid);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 4, PostImageInterceptorOptions))
  addNewPost(
    @getCurrentUserId() userId: number,
    @Body() body: CreatePostDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<CreatePostResType> {
    const filenames = files.map((file) => basename(file.path));
    return this.postService.addNewPost(userId, body, filenames);
  }

  @Delete(':username/:postid')
  deleteSinglePostById(
    @Param('postid', ParseIntPipe) postid: number,
  ): Promise<{ id: number }> {
    return this.postService.deleteSinglePostById(postid);
  }
}
