import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

import { FollowModule } from 'src/follow/follow.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [FollowModule, PostModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
