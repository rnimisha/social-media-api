import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PostModule } from '../post/post.module';

@Module({
  imports: [PostModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
