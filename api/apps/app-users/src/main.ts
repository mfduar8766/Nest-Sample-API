import { NestFactory } from '@nestjs/core';
import { AppUsersModule } from './app-users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ENV } from '@app/shared-modules';
import { Logger, ShutdownSignal } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

(async () => {
  const logger = new Logger();
  const app = await NestFactory.create(AppUsersModule);
  const configService = app.get(ConfigService);
  const env = configService.get('NODE_ENV');
  const host =
    env === ENV.DEVELOPMENT
      ? configService.get('USER_SERVICE_HOST')
      : 'localhost';
  const port =
    env === ENV.DEVELOPMENT ? configService.get('USER_SERVICE_PORT') : 8080;
  const options: MicroserviceOptions = {
    transport: Transport.TCP,
    options: {
      host,
      port,
    },
  };
  app.connectMicroservice<MicroserviceOptions>(options);
  app.enableShutdownHooks([ShutdownSignal.SIGINT, ShutdownSignal.SIGTERM]);
  app.useLogger(logger);
  app.startAllMicroservices();
  logger.log(
    `Microservice app-users is listening on tcp://${
      env === ENV.DEVELOPMENT ? host : 'localhost'
    }:${env === ENV.DEVELOPMENT ? Number(port) : 8080}...`,
  );
})();
