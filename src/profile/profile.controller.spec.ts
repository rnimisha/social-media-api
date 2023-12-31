import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UpdateUserDto } from './dto';
import { NotFoundException } from '@nestjs/common';
import { ProfileType } from './types';

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            getUserProfile: jest.fn(),
            updateUserProfile: jest.fn(),
            deleteUserProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
  });

  describe('GET profile/:user getUserProfile ', () => {
    describe('valid and existig username is provided', () => {
      it('should return profile detail of the user', async () => {
        const user = 'kiko';

        const expected: ProfileType = {
          id: expect.any(Number),
          email: 'kiko@gmail.com',
          username: user,
          name: 'kiki',
          createdAt: new Date(),
          profilePic: '1687367056629-6f86243b481146aea870c7ad9102ffbf.png',
          coverPic: '1687367056634-7549eed858ea4bf39b5603a4f05dcb46.png',
          followerCount: 0,
          followingCount: 1,
          postCount: 4,
        };

        jest
          .spyOn(profileService, 'getUserProfile')
          .mockResolvedValue(expected);

        const actual = await controller.getUserProfile(user);

        expect(actual).toEqual(expected);
        expect(profileService.getUserProfile).toHaveBeenCalledWith(user);
      });
    });

    describe('non existing username is provided', () => {
      it('should throw not found error', async () => {
        jest
          .spyOn(profileService, 'getUserProfile')
          .mockRejectedValue(new NotFoundException());

        await expect(
          controller.getUserProfile('unknownuser'),
        ).rejects.toThrowError(NotFoundException);
      });
    });
  });

  describe('PUT profile/:user updateUserProfile ', () => {
    describe('valid profile data is provided', () => {
      it('should return updated profile', async () => {
        const username = 'kiko';
        const data = new UpdateUserDto();

        await controller.updateUserProfile(username, {}, data);

        expect(profileService.updateUserProfile).toHaveBeenCalledWith(
          username,
          data,
          {},
        );
      });
    });
  });

  describe('DELETE profile/:user deleteUserProfile ', () => {
    describe('valid and existig username is provided', () => {
      it('should return delete success message', async () => {
        const username = 'kiko';
        const expected = {
          msg: 'user deleted successfully',
        };
        (profileService.deleteUserProfile as jest.Mock).mockResolvedValue(
          expected,
        );

        const actual = await controller.deleteUserProfile(username);

        expect(actual).toEqual(expected);
        expect(profileService.deleteUserProfile).toHaveBeenCalledWith(username);
      });
    });
  });
});
