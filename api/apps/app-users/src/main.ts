import { QUEUES, RabbitMqService } from '@app/shared-modules';
import { SharedLoggerService } from '@app/shared-modules';
import { ShutdownSignal } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppUsersModule } from './app-users.module';

(async () => {
  const logger = new SharedLoggerService('app-users');
  try {
    const app = await NestFactory.create(AppUsersModule);
    const rmqService = app.get(RabbitMqService);
    app.connectMicroservice(rmqService.getOptions(QUEUES.USERS_QUEUE));
    app.enableShutdownHooks([ShutdownSignal.SIGINT, ShutdownSignal.SIGTERM]);
    app.useLogger(logger);

    app.setGlobalPrefix(`api/${process.env.API_VERSION}`);
    app.enableCors({
      origin: `http://localhost:3001`,
      methods: ['GET'],
      // allowedHeaders: process.env.ROLES.split(', ') || [
      //   'USER, ADMIN, SUPER_USER',
      // ],
    });
    await app.startAllMicroservices();
    await app.listen(3001, () => {
      logger.logInfo({
        message: 'REST API listening on: http://localhost:3001',
      });
    });
    logger.logInfo({
      message: `Microservice: app-users getConnectionOptions(): is listening on: ${JSON.stringify(
        {
          url: `${process.env.RABBITMQ_URI}`,
          queues: [QUEUES.USERS_QUEUE],
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
