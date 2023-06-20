import { Controller, Post } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('add/:id')
  likePost() {
    return this.likeService.likePost();
  }

  @Post('remove/:id')
  unlikePost() {
    return this.likeService.unlikePost();
  }
}
