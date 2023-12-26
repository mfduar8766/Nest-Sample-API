import { Module } from '@nestjs/common';
import { AppUsersController } from './app-users.controller';
import { AppUsersService } from './app-users.service';
import { ConfigModule } from '@nestjs/config';
import { ENV, RabbitMqModule, SharedLoggerModule } from '@app/shared-modules';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthCheckModule } from './modules/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./.env.development.local'],
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRoot(
      `${
        process.env.NODE_ENV === ENV.DEVELOPMENT
          ? process.env.MONGODB_URL
          : 'mongodb://mongodb/27017/sample'
      }`,
      {
        retryAttempts: 3,
      },
    ),
    RabbitMqModule,
    HealthCheckModule,
  ],
  controllers: [AppUsersController],
  providers: [AppUsersService, SharedLoggerModule.createLoggerProvider()],
})
export class AppUsersModule {}
