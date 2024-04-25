import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { Server } from 'socket.io';

@Module({
  providers: [
    WebsocketGateway,
    {
      provide: 'WS_SERVER',
      useValue: new Server(), // Instantiate WebSocket server
    },
  ],
})
export class WebsocketModule {}
