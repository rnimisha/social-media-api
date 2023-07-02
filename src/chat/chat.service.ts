import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto, CreateMessageDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatType } from './types';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createChat(createChatDto: CreateChatDto) {
    const chatExists = await this.findParticipantChat(
      createChatDto.participants,
    );

    if (chatExists) throw new BadRequestException('Chat already exists');

    const chat = await this.prisma.chat.create({
      data: {
        participants: {
          connect: createChatDto.participants.map((userId) => ({ id: userId })),
        },
      },
      include: {
        participants: {
          select: {
            username: true,
            name: true,
            id: true,
            profilePic: true,
          },
        },
      },
    });

    return chat;
  }

  async createMessage(createChatDto: CreateMessageDto) {
    const { chatId, content, senderId } = createChatDto;
    const chatExists = await this.checkChatExists(chatId);

    if (!chatExists) throw new NotFoundException('Chat does not exist');

    const message = await this.prisma.message.create({
      data: {
        content: content,
        senderId: senderId,
        chatId: chatId,
      },
    });

    return message;
  }

  async findChatByChatId(chatId: number): Promise<ChatType> {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: chatId,
      },
      include: {
        participants: {
          select: {
            username: true,
            name: true,
            id: true,
            profilePic: true,
          },
        },
        messages: true,
      },
    });

    return chat;
  }

  async findAllUserChat(userId: number): Promise<ChatType[]> {
    const chat = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        participants: {
          select: {
            username: true,
            name: true,
            id: true,
            profilePic: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return chat;
  }

  join() {
    return `This action returns all chat`;
  }

  typing() {
    return `This action returns all chat`;
  }

  //---------- helpers----------------------
  async findParticipantChat(participants: number[]) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        participants: {
          some: { id: { in: participants } },
        },
      },
      include: {
        participants: true,
      },
    });

    if (chat) {
      const participantIds = chat.participants.map(
        (participant) => participant.id,
      );
      const hasAllParticipants = participants.every((participant) =>
        participantIds.includes(participant),
      );

      if (!hasAllParticipants) {
        return null;
      }
    }

    return chat;
  }

  async checkChatExists(chatId: number): Promise<boolean> {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: chatId,
      },
    });
    return chat ? true : false;
  }
}
