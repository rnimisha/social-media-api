import { Controller, Get } from '@nestjs/common';
import { FeedService } from './feed.service';
import { getCurrentUser } from 'src/common/decorator';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeedPost(@getCurrentUser('username') username: string) {
    console.log(username);
    return this.feedService.getFeedPost(username);
  }
}
