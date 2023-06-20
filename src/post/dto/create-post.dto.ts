import { IsAlphanumeric, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  @MaxLength(250)
  description: string;

  images: string[];
}
