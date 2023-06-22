import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UpdateUserDto } from './dto';

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

        const profileValue = {
          id: expect.any(Number),
          email: 'kiko@gmail.com',
          username: user,
          name: 'kiki',
          createdAt: '2023-06-19T17:01:55.745Z',
          profilePic: '1687367056629-6f86243b481146aea870c7ad9102ffbf.png',
          coverPic: '1687367056634-7549eed858ea4bf39b5603a4f05dcb46.png',
          followerCount: 0,
          followingCount: 1,
          postCount: 4,
        };

        (profileService.getUserProfile as jest.Mock).mockResolvedValue(
          profileValue,
        );

        const resp = await controller.getUserProfile(user);

        expect(resp).toEqual(profileValue);
        expect(profileService.getUserProfile).toHaveBeenCalledWith(user);
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
        const respValue = {
          msg: 'user deleted successfully',
        };
        (profileService.deleteUserProfile as jest.Mock).mockResolvedValue(
          respValue,
        );

        const resp = await controller.deleteUserProfile(username);

        expect(resp).toEqual(respValue);
        expect(profileService.deleteUserProfile).toHaveBeenCalledWith(username);
      });
    });
  });
});
