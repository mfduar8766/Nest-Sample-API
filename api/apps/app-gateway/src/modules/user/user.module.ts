import { Module } from '@nestjs/common';
import { RolesGuard } from '../../guards/applicationRoles.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  APP_GUARD,
  RabbitMqModule,
  QUEUES,
  SERVICES,
  SharedLoggerService,
} from '@app/shared-modules';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./.env.development.local', './rabbitmq-env.conf'],
      isGlobal: true,
      cache: true,
    }),
    RabbitMqModule.registerClient(SERVICES.USER_SERVICE, QUEUES.USERS_QUEUE),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: SERVICES.LOGGER_SERVICE,
      useFactory: () => new SharedLoggerService(UsersModule.name),
    },
    UserService,
  ],
})
export class UsersModule {}
