import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileService } from '../profile/profile.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto';

describe('PostService', () => {
  let service: PostService;
  let prismaService: PrismaService;
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [PostService, PrismaService, ProfileService],
    }).compile();

    service = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);
    profileService = module.get<ProfileService>(ProfileService);
  });

  describe('getSingleUserPost', () => {
    describe('valid username is provided', () => {
      it('should return array of post of the user', async () => {
        const username = 'testuser';
        const singlePost = {
          id: expect.any(Number),
          description: 'desc',
          createdAt: new Date(),
          userId: 1,
          images: [],
          likes: [],
          comments: [],
        };

        const expected = Array(5).fill(singlePost);

        jest.spyOn(profileService, 'checkUserExist').mockResolvedValue(1);
        jest.spyOn(service, 'getMultipleUserPost').mockResolvedValue(expected);

        const actual = await service.getSingleUserPost(username);

        expect(actual).toBe(expected);
        expect(profileService.checkUserExist).toHaveBeenCalledTimes(1);
        expect(service.getMultipleUserPost).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('invalid username is provided', () => {
    it('should return array of post of the user', async () => {
      jest
        .spyOn(profileService, 'checkUserExist')
        .mockRejectedValue(new NotFoundException());

      await expect(
        service.getSingleUserPost('unknownuser'),
      ).rejects.toThrowError(NotFoundException);

      expect(profileService.checkUserExist).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPostByPostId', () => {
    describe('valid post id is provided', () => {
      it('should return post details for the id', async () => {
        const postId = 1;

        const expected = {
          id: 1,
          description: 'description',
          createdAt: new Date(),
          userId: expect.any(Number),
          images: [],
          likes: [],
          comments: [],
        };

        jest.spyOn(prismaService.post, 'findFirst').mockResolvedValue(expected);

        const acutal = await service.getPostByPostId(postId);

        expect(acutal).toBe(expected);
        expect(prismaService.post.findFirst).toHaveBeenCalledTimes(1);
      });
    });

    describe('not existing post id is provided', () => {
      it('should throw not found error', async () => {
        const postId = 1;

        jest.spyOn(prismaService.post, 'findFirst').mockResolvedValue(null);

        await expect(service.getPostByPostId(postId)).rejects.toThrowError(
          NotFoundException,
        );

        expect(prismaService.post.findFirst).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('addNewPost', () => {
    describe('valid post details are provided', () => {
      it('should add and returned the new post', async () => {
        const userId = 1;
        const data = new CreatePostDto();
        const images = ['img1.jpg', 'img1.jpg'];

        const expected = {
          id: 10,
          description: 'description',
          createdAt: new Date(),
          userId: 1,
          images: [
            {
              id: 1,
              basename: 'img1.jpg',
              postId: 10,
            },
            {
              id: 2,
              basename: 'img2.jpg',
              postId: 10,
            },
          ],
          likes: [],
          comments: [],
        };

        jest.spyOn(prismaService.post, 'create').mockResolvedValue(expected);

        const actual = await service.addNewPost(userId, data, images);

        expect(actual).toBe(expected);
        expect(prismaService.post.create).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('deleteSinglePostById', () => {
    describe('valid postid is provided', () => {
      it('should delete and return success message', async () => {
        const postId = 1;

        const expected = {
          id: postId,
          description: 'description',
          createdAt: new Date(),
          userId: expect.any(Number),
          images: [],
          likes: [],
          comments: [],
        };

        jest
          .spyOn(prismaService.post, 'findFirst')
          .mockResolvedValueOnce(expected);
        jest
          .spyOn(prismaService.post, 'delete')
          .mockResolvedValueOnce(expected);

        const acutal = await service.deleteSinglePostById(postId);

        expect(acutal).toBe(expected);
        expect(prismaService.post.findFirst).toHaveBeenCalledTimes(1);
        expect(prismaService.post.delete).toHaveBeenCalledTimes(1);
      });
    });

    describe('not existing post id is provided', () => {
      it('should throw not found error', async () => {
        const postId = 1;

        jest.spyOn(prismaService.post, 'findFirst').mockResolvedValue(null);

        await expect(service.deleteSinglePostById(postId)).rejects.toThrowError(
          NotFoundException,
        );

        expect(prismaService.post.findFirst).toHaveBeenCalledTimes(1);
      });
    });
  });
});
