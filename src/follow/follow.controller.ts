import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { getCurrentUserId } from 'src/common/decorator';
import { FollowReqDto } from './dto';
import { FollowerType, FollowingType } from './types';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get(':username/following')
  getAllFollowing(
    @Param('username') username: string,
  ): Promise<FollowingType[]> {
    return this.followService.getAllFollowing(username);
  }

  @Get(':username/follower')
  getAllFollowers(
    @Param('username') username: string,
  ): Promise<FollowerType[]> {
    return this.followService.getAllFollowers(username);
  }

  @Post()
  followUser(
    @getCurrentUserId() userId: number,
    @Body() data: FollowReqDto,
  ): Promise<{ msg: string }> {
    return this.followService.followUser(userId, data);
  }

  @Delete(':id')
  unfollowUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ msg: string }> {
    return this.followService.unfollowUser(id);
  }
}
