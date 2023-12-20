import { ENV } from '@app/shared-modules';
import { SharedLoggerService } from '@app/shared-modules/modules/logger/logger.service';
import { ShutdownSignal } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http.exception.filter';

(async () => {
  const logger = new SharedLoggerService('app-gateway');
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
      logger.logWarn({
        message: `app-gateway uncaughtException ${HttpStatus.INTERNAL_SERVER_ERROR}`,
        fileName: 'main',
        method: 'uncaughtExceptionHandler',
        value: err,
      });
    });

    await app.listen(env === ENV.DEVELOPMENT ? port : 3000, () =>
      logger.logInfo({
        message: `app-gateway listening on http://${
          env === ENV.DEVELOPMENT ? host : 'localhost'
        }:${env === ENV.DEVELOPMENT ? port : 3000}`,
        fileName: 'main',
        method: 'bootStrap',
      }),
    );
  } catch (error) {
    logger.logError({
      message: `Error starting app-gateway: ${error}`,
      fileName: 'main',
      method: 'bootStrap',
    });
  }
})();
