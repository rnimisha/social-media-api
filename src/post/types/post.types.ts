import { CommentByType } from 'src/comment/types';
import { PostImageType } from './post-image.types';

type LikeType = {
  id: number;
  userId: number;
  postId: number;
};

type CommentType = {
  id: number;
  userId: number;
  postId: number;
  description: string;
  createdAt: Date;
};

export type AuthorType = {
  name: string;
  username: string;
  profilePic: string;
};

export type PostType = {
  id: number;
  description: string;
  createdAt: Date | string;
  userId: number;
  images: PostImageType[];
  likes: LikeType[];
  comments: CommentType[];
  author?: AuthorType;
  commentBy?: CommentByType[];
};
