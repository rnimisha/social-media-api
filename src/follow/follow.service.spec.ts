import { Test, TestingModule } from '@nestjs/testing';
import { FollowService } from './follow.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { FollowReqDto } from './dto';

describe('FollowService', () => {
  let service: FollowService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [FollowService, PrismaService],
    }).compile();

    service = module.get<FollowService>(FollowService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getAllFollowing', () => {
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
          .spyOn(prismaService.follow, 'findMany')
          .mockResolvedValue(expected);
        const actual = await service.getAllFollowing(username);

        expect(actual).toBe(expected);
        expect(prismaService.follow.findMany).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('getAllFollowers', () => {
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
          .spyOn(prismaService.follow, 'findMany')
          .mockResolvedValue(expected);
        const actual = await service.getAllFollowers(username);

        expect(actual).toBe(expected);
        expect(prismaService.follow.findMany).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('followUser', () => {
    describe('valid dto is provided by current current user', () => {
      it('should follow the user in the dto', async () => {
        const userId = 2;
        const data: FollowReqDto = { userToFollowId: 1 };
        const resolved = {
          id: 1,
          followingId: userId,
          followerId: data.userToFollowId,
        };
        const expected = {
          msg: 'User followed successfully',
        };

        jest.spyOn(prismaService.follow, 'create').mockResolvedValue(resolved);
        const actual = await service.followUser(userId, data);

        expect(actual).toStrictEqual(expected);
        expect(prismaService.follow.create).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('unfollowUser', () => {
    describe('valid id is provided', () => {
      it('should delete the follow and return success message', async () => {
        const currentUser = 2;
        const userToUnfollow = 1;
        const resolved = {
          id: expect.any(Number),
          followingId: userToUnfollow,
          followerId: currentUser,
        };

        const expected = {
          msg: 'User unfollowed successfully',
        };

        jest.spyOn(service, 'findFollowId').mockResolvedValue(1);
        jest.spyOn(prismaService.follow, 'delete').mockResolvedValue(resolved);

        const actual = await service.unfollowUser(currentUser, userToUnfollow);

        expect(actual).toStrictEqual(expected);
        expect(prismaService.follow.delete).toHaveBeenCalledTimes(1);
      });
    });
  });
});
