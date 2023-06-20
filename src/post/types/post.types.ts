import { PostImageType } from './post-image.types';

type LikeType = {
  id: number;
  userId: number;
  postId: number;
};

export type PostType = {
  id: number;
  description: string;
  createdAt: Date | string;
  userId: number;
  images: PostImageType[];
  likes: LikeType[];
};
