import { Body, Controller, Delete, Post } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeUnlikeDto } from './dto';
import { getCurrentUserId } from '../common/decorator';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@Controller('like')
@ApiTags('Like')
@ApiSecurity('JWT-access')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiBadRequestResponse({ description: 'Post is already liked by the user' })
  likePost(
    @getCurrentUserId() userId: number,
    @Body() data: LikeUnlikeDto,
  ): Promise<{ id: number }> {
    return this.likeService.likePost(userId, data);
  }

  @Delete()
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiBadRequestResponse({ description: 'Post is not liked yet.' })
  unlikePost(
    @getCurrentUserId() userId: number,
    @Body() data: LikeUnlikeDto,
  ): Promise<{ id: number }> {
    return this.likeService.unlikePost(userId, data);
  }
}
