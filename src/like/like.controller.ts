import { Body, Controller, Delete, Post } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeUnlikeDto } from './dto';
import { getCurrentUserId } from '../common/decorator';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  likePost(
    @getCurrentUserId() userId: number,
    @Body() data: LikeUnlikeDto,
  ): Promise<{ id: number }> {
    return this.likeService.likePost(userId, data);
  }

  @Delete()
  unlikePost(
    @getCurrentUserId() userId: number,
    @Body() data: LikeUnlikeDto,
  ): Promise<{ id: number }> {
    return this.likeService.unlikePost(userId, data);
  }
}
