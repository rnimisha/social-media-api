import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { getCurrentUser } from '../common/decorator';
import { PostType } from '../post/types/post.types';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('feed')
@ApiTags('Feed')
@ApiSecurity('JWT-access')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeedPost(
    @getCurrentUser('username') username: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ): Promise<PostType[]> {
    return this.feedService.getFeedPost(username, page, pageSize);
  }
}
