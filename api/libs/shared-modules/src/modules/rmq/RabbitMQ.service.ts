import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport, Ctx, RmqContext, RmqOptions } from '@nestjs/microservices';

@Injectable()
export class RabbitMqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBITMQ_URI')],
        queue: this.configService.get<string>(
          `RABBITMQ_${queue.toUpperCase()}`,
        ),
        noAck,
        // persistent: true,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  handleContextAcknowledgement(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
