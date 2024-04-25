import { Controller } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Controller()
export class RabbitmqController {
  constructor(private readonly rabbitmqService: RabbitMQService) {}
}
