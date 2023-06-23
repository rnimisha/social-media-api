import { Controller, Get } from '@nestjs/common';
import { FeedService } from './feed.service';
import { getCurrentUser } from '../common/decorator';
import { PostType } from '../post/types/post.types';
import { ApiTags } from '@nestjs/swagger';

@Controller('feed')
@ApiTags('Feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeedPost(
    @getCurrentUser('username') username: string,
  ): Promise<PostType[]> {
    console.log(username);
    return this.feedService.getFeedPost(username);
  }
}
