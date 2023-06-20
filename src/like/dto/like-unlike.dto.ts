import { IsNotEmpty, IsNumber } from 'class-validator';

export class LikeUnlikeDto {
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
