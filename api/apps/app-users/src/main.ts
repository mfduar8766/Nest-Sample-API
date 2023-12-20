import { QUEUES } from '@app/shared-modules';
import { SharedLoggerService } from '@app/shared-modules/modules/logger/logger.service';
import { ShutdownSignal } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppUsersModule } from './app-users.module';

(async () => {
  const logger = new SharedLoggerService('app-users');
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
    logger.logInfo({
      message: `Microservice: app-users getConnectionOptions(): is listening on: ${JSON.stringify(
        {
          url: `${process.env.RABBITMQ_URL}`,
          queues: ['users_queue'],
        },
      )}`,
      method: 'app.listen()',
    });
  } catch (error) {
    logger.logError({
      message: `app-users Error starting app-users`,
      method: 'bootStrap()',
      value: error,
    });
  }
})();
