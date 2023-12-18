import { Module } from '@nestjs/common';
// import {
//   ClientProxyFactory,
//   MicroserviceOptions,
//   Transport,
// } from '@nestjs/microservices';
import { RolesGuard } from '../../guards/applicationRoles.guard';
import { MyLoggerService } from '../logger/logger.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { APP_GUARD, SharedModules, QUEUES } from '@app/shared-modules';
import { ConfigModule } from '@nestjs/config';
import { SERVICES } from '@app/shared-modules/common/models';

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
    // {
    //   provide: USER_SERVICE,
    //   useFactory: (configService: ConfigService) => {
    //     const USERS_QUEUE = configService.get('USERS_QUEUE');
    //     const USER = configService.get('USER');
    //     const PASS = configService.get('PASS');
    //     const HOST = configService.get('HOST');
    //     const options: MicroserviceOptions = {
    //       transport: Transport.RMQ,
    //       options: {
    //         urls: [`amqp://${USER}:${PASS}@${HOST}`],
    //         queue: USERS_QUEUE,
    //         noAck: false,
    //         queueOptions: {
    //           durable: true,
    //         },
    //       },
    //     };
    //     return ClientProxyFactory.create(options);
    //   },
    //   inject: [ConfigService],
    // },
    UserService,
    MyLoggerService,
  ],
})
export class UsersModule {}
