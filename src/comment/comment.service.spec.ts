import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { describe } from 'node:test';
import { PostService } from '../post/post.service';
import { ProfileService } from '../profile/profile.service';
import { CommentDto } from './dto';
import { Comment } from '@prisma/client';

describe('CommentService', () => {
  let service: CommentService;
  let prismaService: PrismaService;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [CommentService, PrismaService, PostService, ProfileService],
    }).compile();

    service = module.get<CommentService>(CommentService);
    prismaService = module.get<PrismaService>(PrismaService);
    postService = module.get<PostService>(PostService);
  });

  describe('getCommentByPostId', () => {
    describe('valid post id is provided', () => {
      it('should return array of comments for the post', async () => {
        const postId = 1;

        const singlePost = {
          id: expect.any(Number),
          description: 'Oh wow 2',
          createdAt: new Date(),
          userId: expect.any(Number),
          postId: postId,
        };
        const expected = Array(3).fill(singlePost);

        jest.spyOn(postService, 'checkPostExists').mockResolvedValue(true);

        jest
          .spyOn(prismaService.comment, 'findMany')
          .mockResolvedValue(expected);

        const actual = await service.getCommentByPostId(postId);

        expect(actual).toEqual(expected);
        expect(postService.checkPostExists).toHaveBeenCalledWith(postId);
        expect(prismaService.comment.findMany).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('addComment', () => {
    describe('valid comment dto is provided', () => {
      it('should add and return the new comment', async () => {
        const postId = 1;

        const dto = new CommentDto();

        const expected = {
          id: expect.any(Number),
          description: 'Oh wow 2',
          createdAt: new Date(),
          userId: expect.any(Number),
          postId: postId,
        };

        jest.spyOn(postService, 'checkPostExists').mockResolvedValue(true);
        jest.spyOn(prismaService.comment, 'create').mockResolvedValue(expected);

        const actual = await service.addComment(dto);

        expect(actual).toEqual(expected);
        expect(postService.checkPostExists).toHaveBeenCalledWith(dto.postId);
        expect(prismaService.comment.create).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('eleteComment', () => {
    describe('valid commentid is provided', () => {
      it('should delete and return the deleted comment', async () => {
        const commentId = 1;

        const expected = { id: commentId };

        jest
          .spyOn(prismaService.comment, 'delete')
          .mockResolvedValue(expected as Comment);

        const actual = await service.deleteComment(commentId);

        expect(actual).toEqual(expected);
        expect(prismaService.comment.delete).toHaveBeenCalledTimes(1);
      });
    });
  });
});
