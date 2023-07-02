import { MessageType, ParticipantType } from '.';

export type ChatType = {
  id: number;
  createdAt: Date;
  participants: ParticipantType[];
  messages: MessageType[];
};
