import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway {
  @WebSocketServer()
  private server: Server;

  emitMessage(event: string, data: any) {
    this.server.emit(event, data);
  }
}
