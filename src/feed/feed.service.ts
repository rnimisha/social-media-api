import { Injectable } from '@nestjs/common';
import { FollowService } from 'src/follow/follow.service';
import { PostService } from 'src/post/post.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly followService: FollowService,
    private readonly postService: PostService,
  ) {}

  async getFeedPost(username: string) {
    const followedUsers = await this.followService.getFollowingUsernames(
      username,
    );
    const feedPosts = await this.postService.getMultipleUserPost([
      username,
      ...followedUsers,
    ]);
    return feedPosts;
  }
}
