import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
