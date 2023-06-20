import { Controller, Delete, Get, Post } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':id')
  getCommentByPostId() {
    return this.commentService.getCommentByPostId();
  }

  @Post()
  addComment() {
    return this.commentService.addComment();
  }

  @Delete(':id')
  deleteComment() {
    return this.commentService.deleteComment();
  }
}
