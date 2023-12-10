import { ShutdownSignal } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http.exception.filter';
import { ENV } from '../../common/models';
import { MyLoggerService } from './modules/logger/logger.service';

(async () => {
  const app = await NestFactory.create(AppModule);
  const logger = new MyLoggerService();
  logger.serviceName = 'nestjs-client';
  app.useLogger(logger);
  app.enableShutdownHooks([ShutdownSignal.SIGINT, ShutdownSignal.SIGTERM]);
  app.setGlobalPrefix(`api/${process.env.API_VERSION}`);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: `http://${
      process.env.NODE_ENV === ENV.DEVELOPMENT ? process.env.HOST : 'localhost'
    }:${process.env.NODE_ENV === ENV.DEVELOPMENT ? process.env.PORT : 3000}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: process.env.ROLES.split(', ') || [
      'USER, ADMIN, SUPER_USER',
    ],
  });

  process.on('uncaughtException', function (err: any) {
    logger.error(HttpStatus.INTERNAL_SERVER_ERROR, err);
  });

  await app.listen(
    process.env.NODE_ENV === ENV.DEVELOPMENT ? process.env.PORT : 3000,
    () =>
      logger.log(
        `nestjs-client listening on http://${
          process.env.NODE_ENV === ENV.DEVELOPMENT
            ? process.env.HOST
            : 'localhost'
        }:${
          process.env.NODE_ENV === ENV.DEVELOPMENT ? process.env.PORT : 3000
        }`,
      ),
  );
})();
