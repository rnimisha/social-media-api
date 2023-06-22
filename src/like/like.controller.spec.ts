import { Test, TestingModule } from '@nestjs/testing';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { LikeUnlikeDto } from './dto';

describe('LikeController', () => {
  let controller: LikeController;
  let likeService: LikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeController],
      providers: [
        {
          provide: LikeService,
          useValue: {
            likePost: jest.fn(),
            unlikePost: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LikeController>(LikeController);
    likeService = module.get<LikeService>(LikeService);
  });

  describe('POST /like likePost', () => {
    describe('valid data is provided by current user', () => {
      it('should add like row for the post and return like id', async () => {
        const userId = 1;
        const data = new LikeUnlikeDto();

        const expected = { id: 10 };

        jest.spyOn(likeService, 'likePost').mockResolvedValue(expected);

        const actual = await controller.likePost(userId, data);
        expect(actual).toBe(expected);
        expect(likeService.likePost).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('DELETE /like unlikePost', () => {
    describe('valid data is provided by current user', () => {
      it('should delete like row for the post and return like id', async () => {
        const userId = 1;
        const data = new LikeUnlikeDto();

        const expected = { id: 10 };

        jest.spyOn(likeService, 'unlikePost').mockResolvedValue(expected);

        const actual = await controller.unlikePost(userId, data);
        expect(actual).toBe(expected);
        expect(likeService.unlikePost).toHaveBeenCalledTimes(1);
      });
    });
  });
});
