import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto, CreateMessageDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
        participants: true,
      },
    });

    return chat;
  }

  createMessage(createChatDto: CreateMessageDto) {
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
}
