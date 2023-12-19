import { NestFactory } from '@nestjs/core';
import { AppUsersModule } from './app-users.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { QUEUES, SharedModulesService } from '@app/shared-modules';
import { Logger, ShutdownSignal } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

(async () => {
  const logger = new Logger();
  try {
    const app = await NestFactory.create(AppUsersModule);
    const configService = app.get(ConfigService);
    const sharedService = app.get(SharedModulesService);
    const USERS_QUEUE = configService.get('USERS_QUEUE') || QUEUES.users_queue;
    app.connectMicroservice<MicroserviceOptions>(
      sharedService.getConnectionOptions(USERS_QUEUE, 'app-users'),
    );
    app.enableShutdownHooks([ShutdownSignal.SIGINT, ShutdownSignal.SIGTERM]);
    app.useLogger(logger);
    await app.startAllMicroservices();
  } catch (error) {
    logger.error(`Error starting app-users: ${error}`);
  }
})();
