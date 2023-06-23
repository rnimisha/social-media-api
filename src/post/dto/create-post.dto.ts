import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsAlphanumeric()
  @IsNotEmpty()
  @MaxLength(250)
  description: string;

  @ApiProperty()
  images: string[];
}
