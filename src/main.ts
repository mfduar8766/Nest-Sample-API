import { ShutdownSignal } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLoggerService } from './moduels/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(new MyLoggerService());
  app.enableShutdownHooks([ShutdownSignal.SIGTERM, ShutdownSignal.SIGINT]);
  app.setGlobalPrefix(`api/${process.env.API_VERSION}`);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
