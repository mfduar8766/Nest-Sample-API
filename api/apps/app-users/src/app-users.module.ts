import { Module } from '@nestjs/common';
import { AppUsersController } from './app-users.controller';
import { AppUsersService } from './app-users.service';
import { ConfigModule } from '@nestjs/config';
import {
  MongoDbModule,
  RabbitMqModule,
  SharedLoggerModule,
  Users,
  UsersSchema,
} from '@app/shared-modules';
import { HealthCheckModule } from './modules/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./.env.development.local'],
      isGlobal: true,
      cache: true,
    }),
    RabbitMqModule,
    HealthCheckModule,
    MongoDbModule.setMongoDbFeature(Users.name, UsersSchema),
  ],
  controllers: [AppUsersController],
  providers: [AppUsersService, SharedLoggerModule.createLoggerProvider()],
})
export class AppUsersModule {}
