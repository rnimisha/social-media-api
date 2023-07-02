import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  participants: number[];
}
