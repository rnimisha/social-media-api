import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FollowReqDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userToFollowId: number;
}
