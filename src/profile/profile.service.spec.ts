import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto';

describe('ProfileService', () => {
  let service: ProfileService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [ProfileService, PrismaService],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getUserProfile', () => {
    describe('valid username is provided ', () => {
      it('should find and return user detail of matching username', async () => {
        const username = 'anyusername';
        const user = {
          id: 1,
          email: 'test@example.com',
          username: username,
          password: 'password123',
          name: 'Test User',
          createdAt: new Date(),
          profilePic: 'profile.jpg',
          coverPic: 'cover.jpg',
          updatedAt: new Date(),
          refreshToken: 'kfv',
          followers: Array(2).fill(1),
          followings: Array(1).fill(1),
          posts: Array(2).fill(1),
        };

        jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(user);

        const actual = await service.getUserProfile(username);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { followings, followers, posts, ...expected } = {
          ...user,
          followerCount: 2,
          followingCount: 1,
          postCount: 2,
        };

        expect(actual).toEqual(expected);
        expect(prismaService.user.findFirst).toHaveBeenCalledTimes(1);
      });
    });

    describe('not existing username is provided', () => {
      it('should throw not found error', async () => {
        const username = 'anyusername';

        jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

        await expect(service.getUserProfile(username)).rejects.toThrowError(
          NotFoundException,
        );
      });
    });
  });

  describe('updateUserProfile', () => {
    describe('valid username, dto and image path is provided', () => {
      it('should update the usernames details', async () => {
        const username = 'testuser';
        const data = new UpdateUserDto();

        const expected = {
          id: 1,
          email: 'test@example.com',
          username: username,
          password: 'password123',
          name: 'Test User',
          createdAt: new Date(),
          profilePic: 'profile.jpg',
          coverPic: 'cover.jpg',
          updatedAt: new Date(),
          refreshToken: 'kfv',
        };

        jest.spyOn(prismaService.user, 'update').mockResolvedValue(expected);
        jest.spyOn(service, 'checkUserExist').mockResolvedValue(1);

        await service.updateUserProfile(username, data, {});
        expect(prismaService.user.update).toHaveBeenCalledTimes(1);
        expect(service.checkUserExist).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('deleteUserProfile', () => {
    describe('valid username is provided', () => {
      it('should update the usernames details', async () => {
        const username = 'testuser';

        const expected = {
          id: 1,
          email: 'test@example.com',
          username: username,
          password: 'password123',
          name: 'Test User',
          createdAt: new Date(),
          profilePic: 'profile.jpg',
          coverPic: 'cover.jpg',
          updatedAt: new Date(),
          refreshToken: 'kfv',
        };

        jest.spyOn(prismaService.user, 'delete').mockResolvedValue(expected);
        jest.spyOn(service, 'checkUserExist').mockResolvedValue(1);

        await service.deleteUserProfile(username);
        expect(prismaService.user.delete).toHaveBeenCalledTimes(1);
        expect(service.checkUserExist).toHaveBeenCalledTimes(1);
      });
    });
  });
});
