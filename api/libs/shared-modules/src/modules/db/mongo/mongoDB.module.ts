import { DynamicModule, Module } from '@nestjs/common';
import { MongoDbUsersService } from './mongoDBUsers.service';
import { ENV } from '@app/shared-modules/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { SharedLoggerModule } from '../../logger/loggger.module';
import { Schema } from 'mongoose';

@Module({
  providers: [MongoDbUsersService, SharedLoggerModule.createLoggerProvider()],
  exports: [MongoDbUsersService],
})
export class MongoDbModule {
  static setMongoDbFeature(feature: string, schema: Schema): DynamicModule {
    return {
      module: MongoDbModule,
      imports: [
        MongooseModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            uri:
              configService.get<string>('NODE_ENV') === ENV.DEVELOPMENT
                ? configService.get<string>('MONGODB_URL')
                : 'mongodb://mongodb/27017/travel',
            retryAttempts: 3,
          }),
          inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: feature, schema }]),
      ],
      exports: [MongoDbUsersService, MongooseModule],
    };
  }
}
