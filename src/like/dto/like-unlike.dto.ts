import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LikeUnlikeDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
