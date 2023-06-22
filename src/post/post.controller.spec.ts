import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CreatePostDto } from './dto';

describe('PostController', () => {
  let controller: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            getSingleUserPost: jest.fn(),
            getPostByPostId: jest.fn(),
            addNewPost: jest.fn(),
            deleteSinglePostById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  describe('GET /post getSingleUserPost', () => {
    describe('valid username is provided', () => {
      it('should return array of post belonging to the username', async () => {
        const username = 'testuser';
        const singlePost = {
          id: expect.any(Number),
          description: 'desc',
          createdAt: new Date(),
          userId: expect.any(Number),
          images: [],
          likes: [],
          comments: [],
        };

        const expected = Array(5).fill(singlePost);

        jest
          .spyOn(postService, 'getSingleUserPost')
          .mockResolvedValue(expected);

        const actual = await controller.getSingleUserPost(username);

        expect(actual).toEqual(expected);
        expect(postService.getSingleUserPost).toBeCalledTimes(1);
      });
    });
  });

  describe('GET /post/:username/:postid deleteSingleUserPost', () => {
    describe('valid postid is provided', () => {
      it('should return single post detail', async () => {
        const postid = 1;

        const expected = {
          id: expect.any(Number),
          description: 'desc',
          createdAt: new Date(),
          userId: expect.any(Number),
          images: [],
          likes: [],
          comments: [],
        };
        jest.spyOn(postService, 'getPostByPostId').mockResolvedValue(expected);

        const actual = await controller.getPostByPostId(postid);

        expect(postService.getPostByPostId).toHaveBeenCalledWith(postid);
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('Post /post addNewPost', () => {
    describe('valid post detail is provided', () => {
      it('should return single post detail', async () => {
        const userid = 1;
        const dto = new CreatePostDto();
        const imgfile: Express.Multer.File = {
          fieldname: 'images',
          originalname: 'image1.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          size: 1000,
          buffer: Buffer.from('image1'),
          stream: null,
          destination: '',
          filename: '',
          path: '',
        };

        const expected = {
          id: 1,
          description: 'desc',
          createdAt: new Date(),
          userId: userid,
          images: [
            {
              id: 1,
              basename: 'image1.jpg',
              postId: 1,
            },
          ],
        };

        jest.spyOn(postService, 'addNewPost').mockResolvedValue(expected);

        const actual = await controller.addNewPost(userid, dto, [imgfile]);

        expect(postService.addNewPost).toHaveBeenCalledTimes(1);
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('DELETE /post/:username/:postid deleteSingleUserPost', () => {
    describe('valid postid is provided', () => {
      it('should return delete success message', async () => {
        const postid = 1;

        const expected = { id: postid };

        jest
          .spyOn(postService, 'deleteSinglePostById')
          .mockResolvedValue(expected);

        const actual = await controller.deleteSinglePostById(postid);

        expect(actual).toEqual(expected);
        expect(postService.deleteSinglePostById).toBeCalledTimes(1);
      });
    });
  });
});
