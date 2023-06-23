import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './like.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LikeUnlikeDto } from './dto';
import { Like } from '@prisma/client';
import { PostService } from '../post/post.service';
import { ProfileService } from '../profile/profile.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('LikeService', () => {
  let service: LikeService;
  let prismaService: PrismaService;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [LikeService, PrismaService, PostService, ProfileService],
    }).compile();

    service = module.get<LikeService>(LikeService);
    prismaService = module.get<PrismaService>(PrismaService);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('likepost', () => {
    describe('when valid userid and like dto is provided', () => {
      it('should add the like row and return like id', async () => {
        const userId = 1;
        const data = new LikeUnlikeDto();
        const expected = { id: 1 };

        jest.spyOn(postService, 'checkPostExists').mockResolvedValue(true);

        jest
          .spyOn(prismaService.like, 'create')
          .mockResolvedValue(expected as Like);

        const actual = await service.likePost(userId, data);

        expect(prismaService.like.create).toHaveBeenCalledTimes(1);
        expect(actual).toEqual(expected);
      });
    });

    describe('when non existing postid is provided', () => {
      it('should throw post not found exception', async () => {
        const userId = 1;
        const data = new LikeUnlikeDto();

        jest
          .spyOn(postService, 'checkPostExists')
          .mockRejectedValue(new NotFoundException());

        await expect(service.likePost(userId, data)).rejects.toThrowError(
          NotFoundException,
        );

        expect(postService.checkPostExists).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('unlikePost', () => {
    describe('when valid userid and like dto is provided', () => {
      it('should add the like row and return like id', async () => {
        const userId = 1;
        const data = new LikeUnlikeDto();
        const likeData = { id: 1, userId: userId, postId: 1 };
        const expected = { id: likeData.id };

        jest.spyOn(postService, 'checkPostExists').mockResolvedValue(true);
        jest.spyOn(prismaService.like, 'findFirst').mockResolvedValue(likeData);
        jest.spyOn(prismaService.like, 'delete').mockResolvedValue(likeData);

        const actual = await service.unlikePost(userId, data);

        expect(postService.checkPostExists).toHaveBeenCalledTimes(1);
        expect(prismaService.like.findFirst).toHaveBeenCalledTimes(1);
        expect(prismaService.like.delete).toHaveBeenCalledTimes(1);
        expect(actual).toEqual(expected);
      });
    });

    describe('when post is not liked by user yet', () => {
      it('should throw liked post not found exception', async () => {
        const userId = 1;
        const data = new LikeUnlikeDto();

        jest.spyOn(postService, 'checkPostExists').mockResolvedValue(true);
        jest.spyOn(prismaService.like, 'findFirst').mockResolvedValue(null);

        await expect(service.unlikePost(userId, data)).rejects.toThrowError(
          BadRequestException,
        );

        expect(postService.checkPostExists).toHaveBeenCalledTimes(1);
        expect(prismaService.like.findFirst).toHaveBeenCalledTimes(1);
      });
    });
  });
});
