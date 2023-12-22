import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMqService } from './RabbitMQ.service';
import {
  // ClientProxyFactory,
  ClientsModule,
  // MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [RabbitMqService],
  exports: [RabbitMqService],
})
export class RabbitMqModule {
  static registerClient(name: string, queue: string): DynamicModule {
    // const providers: Provider[] = [
    //   {
    //     provide: name,
    //     useFactory: (configService: ConfigService) => {
    //       const options: MicroserviceOptions = {
    //         transport: Transport.RMQ,
    //         options: {
    //           urls: [configService.get<string>('RABBITMQ_URI')],
    //           queue,
    //           persistent: true,
    //           noAck: true,
    //           queueOptions: {
    //             durable: true,
    //           },
    //         },
    //       };
    //       return ClientProxyFactory.create(options);
    //     },
    //     inject: [ConfigService],
    //   },
    // ];
    // return {
    //   module: RabbitMqModule,
    //   providers,
    //   exports: providers,
    // };

    return {
      module: RabbitMqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBITMQ_URI')],
                queue,
                // persistent: true,
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
