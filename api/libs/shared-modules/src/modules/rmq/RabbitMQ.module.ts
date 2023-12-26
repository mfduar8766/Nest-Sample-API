import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMqService } from './RabbitMQ.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [RabbitMqService],
  exports: [RabbitMqService],
})
export class RabbitMqModule {
  static registerClient(name: string, queue: string): DynamicModule {
    return {
      module: RabbitMqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [
                  configService.get<string>('RABBITMQ_URI') ||
                    'amqp://user:password@rabbitmq:5672',
                ],
                queue,
                persistent: true,
                noAck: true,
                queueOptions: {
                  durable: true,
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
