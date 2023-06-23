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
import { getCurrentUserId } from '../common/decorator';
import { CreatePostResType } from './types';
import { PostType } from './types/post.types';
import { ApiNotFoundResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('post')
@ApiTags('Post')
@ApiSecurity('JWT-access')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':username')
  @ApiNotFoundResponse({
    description: 'User does not have post or User not found',
  })
  getSingleUserPost(@Param('username') username: string): Promise<PostType[]> {
    return this.postService.getSingleUserPost(username);
  }

  @Get(':username/:postid')
  @ApiNotFoundResponse({
    description: 'Post with the id not found',
  })
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

  @ApiNotFoundResponse({
    description: 'Post with the id not found',
  })
  @Delete(':username/:postid')
  deleteSinglePostById(
    @Param('postid', ParseIntPipe) postid: number,
  ): Promise<{ id: number }> {
    return this.postService.deleteSinglePostById(postid);
  }
}
