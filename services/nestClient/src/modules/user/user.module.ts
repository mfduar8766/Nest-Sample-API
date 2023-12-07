import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RolesGuard } from '../../guards/applicationRoles.guard';
import { APP_GUARD, ENV, USER_SERVICE } from '../../models/constants';
import { MyLoggerService } from '../logger/logger.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host:
            process.env.NODE_ENV === ENV.DEVELOPMENT
              ? process.env.USER_SERVICE_HOST
              : 'localhost',
          port:
            process.env.NODE_ENV === ENV.DEVELOPMENT
              ? Number(process.env.USER_SERVICE_PORT)
              : 3000,
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    UserService,
    MyLoggerService,
  ],
})
export class UsersModule {}
