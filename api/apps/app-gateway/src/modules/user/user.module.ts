import { Module } from '@nestjs/common';
import { RolesGuard } from '../../guards/applicationRoles.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  APP_GUARD,
  RabbitMqModule,
  QUEUES,
  SERVICES,
  SharedLoggerModule,
} from '@app/shared-modules';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./.env.development.local'],
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
    SharedLoggerModule.createLoggerProvider(),
    UserService,
  ],
})
export class UsersModule {}
