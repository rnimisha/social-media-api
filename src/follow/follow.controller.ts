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
import { getCurrentUserId } from '../common/decorator';
import { FollowReqDto } from './dto';
import { FollowUserType, FollowerType, FollowingType } from './types';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('follow')
@ApiTags('Follow')
@ApiSecurity('JWT-access')
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

  @Get('usertofollow')
  getUserToFollow(
    @getCurrentUserId() userId: number,
  ): Promise<FollowUserType[]> {
    return this.followService.getUserToFollow(userId);
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
    @getCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ msg: string }> {
    return this.followService.unfollowUser(userId, id);
  }
}
