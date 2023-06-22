import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

        const profile = await service.getUserProfile(username);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { followings, followers, posts, ...withCount } = {
          ...user,
          followerCount: 2,
          followingCount: 1,
          postCount: 2,
        };

        expect(profile).toEqual(withCount);
        expect(prismaService.user.findFirst).toHaveBeenCalled();
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
});
