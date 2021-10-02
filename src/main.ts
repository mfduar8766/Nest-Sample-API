import { ShutdownSignal } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLoggerService } from './modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new MyLoggerService();
  logger.serviceName = 'nestjs_api_dev';
  app.useLogger(logger);
  app.enableShutdownHooks([ShutdownSignal.SIGTERM, ShutdownSignal.SIGINT]);
  app.setGlobalPrefix(`api/${process.env.API_VERSION}`);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
