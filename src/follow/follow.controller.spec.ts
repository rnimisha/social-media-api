import { Test, TestingModule } from '@nestjs/testing';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { FollowReqDto } from './dto';

describe('FollowController', () => {
  let controller: FollowController;
  let followService: FollowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowController],
      providers: [
        {
          provide: FollowService,
          useValue: {
            getAllFollowing: jest.fn(),
            getAllFollowers: jest.fn(),
            followUser: jest.fn(),
            unfollowUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FollowController>(FollowController);
    followService = module.get<FollowService>(FollowService);
  });

  describe('GET /follow/:username/following getAllFollowing', () => {
    describe('valid username is provided', () => {
      it('should return array of following of the user', async () => {
        const username = 'test';

        const singleFollowing = {
          id: expect.any(Number),
          followingUser: {
            id: expect.any(Number),
            username: expect.any(String),
            profilePic: expect.any(String),
            name: 'test',
          },
        };

        const expected = Array(5).fill(singleFollowing);

        jest
          .spyOn(followService, 'getAllFollowing')
          .mockResolvedValue(expected);
        const actual = await controller.getAllFollowing(username);

        expect(actual).toBe(expected);
        expect(followService.getAllFollowing).toHaveBeenCalledWith(username);
      });
    });
  });

  describe('GET /follow/:username/follower getAllFollowers', () => {
    describe('valid username is provided', () => {
      it('should return array of follower of the user', async () => {
        const username = 'test';

        const singleFollower = {
          id: expect.any(Number),
          followerUser: {
            id: expect.any(Number),
            username: expect.any(String),
            profilePic: expect.any(String),
            name: 'test',
          },
        };

        const expected = Array(5).fill(singleFollower);

        jest
          .spyOn(followService, 'getAllFollowers')
          .mockResolvedValue(expected);
        const actual = await controller.getAllFollowers(username);

        expect(actual).toBe(expected);
        expect(followService.getAllFollowers).toHaveBeenCalledWith(username);
      });
    });
  });

  describe('POST  followUser', () => {
    describe('valid dto is provided by current current user', () => {
      it('should follow the user in the dto', async () => {
        const userId = 2;
        const data: FollowReqDto = { userToFollowId: 1 };
        const expected = {
          msg: 'User followed successfully',
        };

        jest.spyOn(followService, 'followUser').mockResolvedValue(expected);
        const actual = await controller.followUser(userId, data);

        expect(actual).toBe(expected);
        expect(followService.followUser).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('DELETE unfollowUser/:id', () => {
    describe('valid id is provided', () => {
      it('should delete the follow and return success message', async () => {
        const followId = 2;
        const userToUnfollow = 1;
        const expected = {
          msg: 'User unfollowed successfully',
        };

        jest.spyOn(followService, 'unfollowUser').mockResolvedValue(expected);
        const actual = await controller.unfollowUser(followId, userToUnfollow);

        expect(actual).toBe(expected);
        expect(followService.unfollowUser).toHaveBeenCalledTimes(1);
      });
    });
  });
});
