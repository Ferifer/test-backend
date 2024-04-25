import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { WebsocketGateway } from './rabbitmq/websocket.gateway';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('send-message')
  async sendMessage(@Body() body: { queue: string; message: string }) {
    await this.appService.sendMessage(body.queue, body.message);
    this.websocketGateway.emitMessage('message', 'New message received');
    return 'Message sent';
  }

  @Get('receive-message')
  async receiveMessage() {
    return await this.appService.receiveMessage('userA');
  }
}
