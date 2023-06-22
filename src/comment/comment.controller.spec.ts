import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentDto } from './dto';
import { Comment } from '@prisma/client';

describe('CommentController', () => {
  let controller: CommentController;
  let commentService: CommentService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: {
            getCommentByPostId: jest.fn(),
            addComment: jest.fn(),
            deleteComment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  describe('GET comment/post/:postId getCommentByPostId', () => {
    describe('valid postid is provided', () => {
      it('should return array of comment of the postid', async () => {
        const postId = 1;

        const singlePost = {
          id: expect.any(Number),
          description: 'Oh wow 2',
          createdAt: new Date(),
          userId: expect.any(Number),
          postId: postId,
        };
        const expected = Array(3).fill(singlePost);

        jest
          .spyOn(commentService, 'getCommentByPostId')
          .mockResolvedValue(expected);

        const actual = await controller.getCommentByPostId(postId);

        expect(actual).toEqual(expected);
        expect(commentService.getCommentByPostId).toHaveBeenCalledWith(postId);
      });
    });
  });

  describe('POST comment/ addComment', () => {
    describe('valid dto is provided', () => {
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

        jest.spyOn(commentService, 'addComment').mockResolvedValue(expected);

        const actual = await controller.addComment(dto);

        expect(actual).toEqual(expected);
        expect(commentService.addComment).toHaveBeenCalledWith(dto);
      });
    });
  });

  describe('DELETE comment/:commentId deleteComment', () => {
    describe('valid commentid is provided', () => {
      it('should delete and return the deleted comment', async () => {
        const commentId = 1;

        const expected = { id: commentId };

        jest
          .spyOn(commentService, 'deleteComment')
          .mockResolvedValue(expected as Comment);

        const actual = await controller.deleteComment(commentId);

        expect(actual).toEqual(expected);
        expect(commentService.deleteComment).toHaveBeenCalledWith(commentId);
      });
    });
  });
});
