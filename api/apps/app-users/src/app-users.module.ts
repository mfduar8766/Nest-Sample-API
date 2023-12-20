import { Module } from '@nestjs/common';
import { AppUsersController } from './app-users.controller';
import { AppUsersService } from './app-users.service';
import { ConfigModule } from '@nestjs/config';
import {
  ENV,
  LOGGER_SERVICE,
  SharedLoggerModule,
  SharedModules,
} from '@app/shared-modules';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./.env.development.local', './rabbitmq-env.conf'],
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
    SharedModules,
  ],
  controllers: [AppUsersController],
  providers: [
    AppUsersService,
    {
      provide: LOGGER_SERVICE,
      useClass: SharedLoggerModule,
    },
  ],
})
export class AppUsersModule {}
