import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ENV } from '../../common/models/constants';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
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
    UserModule,
  ],
})
export class AppModule {}
