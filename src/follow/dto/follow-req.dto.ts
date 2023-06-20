import { IsNotEmpty, IsNumber } from 'class-validator';

export class FollowReqDto {
  @IsNumber()
  @IsNotEmpty()
  userToFollowId: number;
}
