import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  participants: number[];
}
