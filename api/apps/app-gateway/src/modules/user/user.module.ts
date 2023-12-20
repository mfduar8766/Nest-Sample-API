import { Module } from '@nestjs/common';
import { RolesGuard } from '../../guards/applicationRoles.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  APP_GUARD,
  LOGGER_SERVICE,
  SharedLoggerModule,
  SharedModules,
} from '@app/shared-modules';
import { ConfigModule } from '@nestjs/config';
import { QUEUES, SERVICES } from '@app/shared-modules/common/models';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./.env.development.local', './rabbitmq-env.conf'],
      isGlobal: true,
      cache: true,
    }),
    SharedModules.registerServices(SERVICES.USER_SERVICE, QUEUES.users_queue),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: LOGGER_SERVICE,
      useClass: SharedLoggerModule,
    },
    UserService,
  ],
})
export class UsersModule {}
