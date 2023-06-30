import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  create(createChatDto: CreateChatDto) {
    const message = { ...createChatDto };
    // do
    return message;
  }

  findAll() {
    return `This action returns all chat`;
  }

  join() {
    return `This action returns all chat`;
  }

  typing() {
    return `This action returns all chat`;
  }
}
