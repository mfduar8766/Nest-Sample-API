import { ShutdownSignal } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http.exception.filter';
<<<<<<< HEAD:api/apps/app-gateway/src/main.ts
=======
import { ENV } from './common/models';
>>>>>>> 8112c2d71290c0c501d2f16a9dd5b865668014b5:services/app-gateway/src/main.ts
import { MyLoggerService } from './modules/logger/logger.service';
import { ENV } from '@app/shared-modules';
import { ConfigService } from '@nestjs/config';

(async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const env = configService.get('NODE_ENV') || ENV.DEVELOPMENT;
  const host =
    env === ENV.DEVELOPMENT ? configService.get('HOST') : 'localhost';
  const port =
    env === ENV.DEVELOPMENT ? configService.get('GATE_WAY_PORT') : 3000;

  const logger = new MyLoggerService();
  logger.serviceName = 'nestjs-client';
  app.useLogger(logger);
  app.enableShutdownHooks([ShutdownSignal.SIGINT, ShutdownSignal.SIGTERM]);
  app.setGlobalPrefix(`api/${process.env.API_VERSION}`);
  app.useGlobalFilters(new HttpExceptionFilter());
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
    logger.error(HttpStatus.INTERNAL_SERVER_ERROR, err);
  });

  await app.listen(env === ENV.DEVELOPMENT ? port : 3000, () =>
    logger.log(
      `nestjs-client listening on http://${
        env === ENV.DEVELOPMENT ? host : 'localhost'
      }:${env === ENV.DEVELOPMENT ? port : 3000}`,
    ),
  );
})();
