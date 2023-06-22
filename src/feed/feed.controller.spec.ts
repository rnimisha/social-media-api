import { Test, TestingModule } from '@nestjs/testing';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

describe('FeedController', () => {
  let controller: FeedController;
  let feedService: FeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [
        {
          provide: FeedService,
          useValue: {
            getFeedPost: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FeedController>(FeedController);
    feedService = module.get<FeedService>(FeedService);
  });

  describe('GET /feed getFeedPost', () => {
    describe('valid username is provided', () => {
      it('should return array of post of follwing users', async () => {
        const username = 'testuser';
        const singlePost = {
          id: expect.any(Number),
          description: 'desc',
          createdAt: new Date(),
          userId: expect.any(Number),
          images: [],
          likes: [],
          comments: [],
        };

        const expected = Array(5).fill(singlePost);

        jest.spyOn(feedService, 'getFeedPost').mockResolvedValue(expected);

        const actual = await controller.getFeedPost(username);

        expect(actual).toBe(expected);
        expect(feedService.getFeedPost).toHaveBeenCalledWith(username);
      });
    });
  });
});
