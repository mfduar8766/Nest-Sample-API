import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { ENV } from '../../common/models/constants';

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
