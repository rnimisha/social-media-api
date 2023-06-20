import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('post/:postId')
  getCommentByPostId() {
    return this.commentService.getCommentByPostId();
  }

  @Post()
  addComment(@Body() data: CommentDto) {
    return this.commentService.addComment(data);
  }

  @Delete(':commentId')
  deleteComment() {
    return this.commentService.deleteComment();
  }
}
