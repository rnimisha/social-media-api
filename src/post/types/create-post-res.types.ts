import { PostImageType } from './post-image.type';

export type CreatePostResType = {
  id: number;
  description: string;
  createdAt: Date | string;
  userId: number;
  images: PostImageType[];
};
