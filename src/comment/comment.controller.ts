import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './dto';
import { CommentType } from './types';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('post/:postId')
  getCommentByPostId(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<CommentType[]> {
    return this.commentService.getCommentByPostId(postId);
  }

  @Post()
  addComment(@Body() data: CommentDto): Promise<CommentType> {
    return this.commentService.addComment(data);
  }

  @Delete(':commentId')
  deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<{ id: number }> {
    return this.commentService.deleteComment(commentId);
  }
}
