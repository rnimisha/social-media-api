import { Injectable } from '@nestjs/common';
import { FollowService } from '../follow/follow.service';
import { PostService } from '../post/post.service';
import { PostType } from '../post/types/post.types';

@Injectable()
export class FeedService {
  constructor(
    private readonly followService: FollowService,
    private readonly postService: PostService,
  ) {}

  async getFeedPost(username: string): Promise<PostType[]> {
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
