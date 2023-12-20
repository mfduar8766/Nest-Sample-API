import { ShutdownSignal } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http.exception.filter';
import { MyLoggerService } from './modules/logger/logger.service';
import { ENV } from '@app/shared-modules';
import { ConfigService } from '@nestjs/config';

(async () => {
  const logger = new MyLoggerService();
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const env = configService.get('NODE_ENV') || ENV.DEVELOPMENT;
    const host =
      env === ENV.DEVELOPMENT
        ? configService.get('GATE_WAY_HOST')
        : 'localhost';
    const port =
      env === ENV.DEVELOPMENT ? configService.get('GATE_WAY_PORT') : 3000;
    logger.serviceName = 'nestjs-client';
    app.enableShutdownHooks([ShutdownSignal.SIGINT, ShutdownSignal.SIGTERM]);
    app.setGlobalPrefix(`api/${process.env.API_VERSION}`);
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useLogger(logger);
    app.enableCors({
      origin: `http://${env === ENV.DEVELOPMENT ? host : 'localhost'}:${
        env === ENV.DEVELOPMENT ? port : 3000
      }`,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: process.env.ROLES.split(', ') || [
        'USER, ADMIN, SUPER_USER',
      ],
    });

    process.on('uncaughtException', function (err: any) {
      logger.error(
        `app-gateway uncaughtException ${HttpStatus.INTERNAL_SERVER_ERROR}`,
        err,
      );
    });

    await app.listen(env === ENV.DEVELOPMENT ? port : 3000, () =>
      logger.log(
        `nestjs-client listening on http://${
          env === ENV.DEVELOPMENT ? host : 'localhost'
        }:${env === ENV.DEVELOPMENT ? port : 3000}`,
      ),
    );
  } catch (error) {
    logger.error(`Error starting app-gateway: ${error}`);
  }
})();
