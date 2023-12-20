import { DynamicModule, Module, Provider } from '@nestjs/common';
import { SharedModulesService } from './shared-modules.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MicroserviceOptions,
  Transport,
  ClientProxyFactory,
} from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./.env.development.local', './rabbitmq-env.conf'],
      isGlobal: true,
      cache: true,
    }),
  ],
  providers: [SharedModulesService],
  exports: [SharedModulesService],
})
export class SharedModules {
  static registerServices(service: string, queue: string): DynamicModule {
    const providers: Provider[] = [
      {
        provide: service,
        useFactory: (configService: ConfigService) => {
          const USER = configService.get('USER');
          const PASS = configService.get('PASS');
          const HOST = configService.get('HOST');
          const options: MicroserviceOptions = {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASS}@${HOST}`],
              queue,
              noAck: true,
              queueOptions: {
                durable: true,
              },
            },
          };
          return ClientProxyFactory.create(options);
        },
        inject: [ConfigService],
      },
    ];
    return {
      module: SharedModules,
      providers,
      exports: providers,
    };
  }
}
