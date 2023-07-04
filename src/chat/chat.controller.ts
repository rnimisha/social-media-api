import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { getCurrentUserId } from 'src/common/decorator';
import { CreateChatDto } from './dto';
import { ChatType } from './types';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('chat/:chatId')
  findChatByChatId(
    @Param('chatId', ParseIntPipe) chatId: number,
  ): Promise<ChatType> {
    return this.chatService.findChatByChatId(chatId);
  }

  @Get('user')
  findAllUserChat(@getCurrentUserId() userId: number): Promise<ChatType[]> {
    return this.chatService.findAllUserChat(userId);
  }

  @Get('userchat')
  getChatBetweenUsers(
    @getCurrentUserId() userId: number,
    @Body() data: CreateChatDto,
  ): Promise<{ id: number }> {
    if (!data.participants.includes(userId))
      throw new UnauthorizedException('Cannot access the messages');
    return this.chatService.getChatBetweenUsers(data);
  }

  @Post('')
  createChat(@Body() data: CreateChatDto) {
    console.log(data);
    return this.chatService.createChat(data);
  }
}
