import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';

import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from './dto';

@WebSocketGateway({
  cors: '*',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createMessage')
  async createMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    const message = await this.chatService.createMessage(createMessageDto);
    this.server.emit('receiveMessage', message);
    return message;
  }

  @SubscribeMessage('join')
  joinRoom() {
    return this.chatService.join();
  }

  @SubscribeMessage('typing')
  tying() {
    return this.chatService.typing();
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }
}
