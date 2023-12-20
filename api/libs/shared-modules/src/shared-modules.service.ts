import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Ctx,
  MicroserviceOptions,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { QUEUES } from './common';
import { TQueueNames } from './common/models';

@Injectable()
export class SharedModulesService {
  constructor(private readonly configService: ConfigService) {}

  getConnectionOptions(
    queue: TQueueNames,
    serviceName: string,
  ): MicroserviceOptions {
    const USER = this.configService.get('USER');
    const PASS = this.configService.get('PASS');
    const HOST = this.configService.get('HOST');
    const maxConnectionAttempts = this.configService.get(
      'MAX_RE_CONNECT_ATTEMPTS',
    );
    const options: MicroserviceOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${USER}:${PASS}@${HOST}`],
        queue: QUEUES[queue],
        noAck: false,
        queueOptions: {
          durable: true,
          maxConnectionAttempts: Number(maxConnectionAttempts),
        },
      },
    };
    console.log(
      `Microservice: ${serviceName} getConnectionOptions(): is listening on: ${JSON.stringify(
        {
          url: `amqp://${USER}:${PASS}@${HOST}`,
          queues: [QUEUES[queue]],
        },
      )}`,
    );
    return options;
  }

  handleContextAcknowledgement(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
