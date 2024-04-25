// rabbitmq.service.ts
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async connect() {
    try {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async sendMessage(queue: string, message: string) {
    if (!this.channel) {
      await this.connect();
    }
    await this.channel.assertQueue(queue);
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async receiveMessage(queue: string, callback: (message: string) => void) {
    if (!this.channel) {
      await this.connect();
    }
    await this.channel.assertQueue(queue);
    this.channel.consume(queue, (msg) => {
      if (msg !== null) {
        callback(msg.content.toString());
        this.channel.ack(msg);
      }
    });
  }

  async close() {
    await this.connection.close();
  }
}
