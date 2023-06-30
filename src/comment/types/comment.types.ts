export type CommentByType = {
  name: string;
  username: string;
  profilePic: string;
};
export type CommentType = {
  id: number;
  description: string;
  createdAt: Date;
  userId: number;
  postId: number;
  commentBy?: CommentByType;
};
