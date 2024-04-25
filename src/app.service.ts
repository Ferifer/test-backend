import { Injectable } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';

@Injectable()
export class AppService {
  constructor(private readonly rabbitmqService: RabbitMQService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async sendMessage(queue: string, message: string) {
    await this.rabbitmqService.sendMessage(queue, message);
  }

  async receiveMessage(queue: string) {
    return new Promise<string>((resolve) => {
      this.rabbitmqService.receiveMessage(queue, (message) => {
        resolve(message);
      });
    });
  }
}
