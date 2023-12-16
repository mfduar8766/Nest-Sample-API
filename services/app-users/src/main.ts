import { Logger, ShutdownSignal } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ENV } from './common/models/constants';
import { AppModule } from './app.module';

const logger = new Logger();

(async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host:
          process.env.NODE_ENV === ENV.DEVELOPMENT
            ? process.env.USER_SERVICE_HOST
            : 'localhost',
        port:
          process.env.NODE_ENV === ENV.DEVELOPMENT
            ? Number(process.env.USER_SERVICE_PORT)
            : 8080,
      },
    },
  );
  app.enableShutdownHooks([ShutdownSignal.SIGINT, ShutdownSignal.SIGTERM]);
  app.listen(() => {
    logger.log(
      `Microservice app-user is listening on tcp://${
        process.env.NODE_ENV === ENV.DEVELOPMENT
          ? process.env.USER_SERVICE_HOST
          : 'localhost'
      }:${
        process.env.NODE_ENV === ENV.DEVELOPMENT
          ? Number(process.env.USER_SERVICE_PORT)
          : 8080
      }...`,
    );
  });
})();
