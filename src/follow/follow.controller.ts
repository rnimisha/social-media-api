import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get(':username/following')
  getAllFollowing(@Param('username') username: string) {
    return this.followService.getAllFollowing(username);
  }

  @Get(':username/follower')
  getAllFollowers() {
    return this.followService.getAllFollowers();
  }

  @Post()
  followUser(): Promise<{ msg: string }> {
    return this.followService.followUser();
  }

  @Delete()
  unfollowUser(): Promise<{ msg: string }> {
    return this.followService.unfollowUser();
  }
}
