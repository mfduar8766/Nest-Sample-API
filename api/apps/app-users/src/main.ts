import { NestFactory } from '@nestjs/core';
import { AppUsersModule } from './app-users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ShutdownSignal } from '@nestjs/common';
import { QUEUES } from '@app/shared-modules';

(async () => {
  const logger = new Logger();
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppUsersModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: [`${process.env.RABBITMQ_URL}`],
          queue: QUEUES.users_queue,
          noAck: false,
          queueOptions: {
            durable: true,
          },
        },
      },
    );
    app.enableShutdownHooks([ShutdownSignal.SIGINT, ShutdownSignal.SIGTERM]);
    app.useLogger(logger);
    await app.listen();
    logger.log(
      `Microservice: app-users getConnectionOptions(): is listening on: ${JSON.stringify(
        {
          url: `${process.env.RABBITMQ_URL}`,
          queues: ['users_queue'],
        },
      )}`,
    );
  } catch (error) {
    logger.error(
      `app-users Error starting app-users: ${JSON.stringify(error)}`,
    );
  }
})();
