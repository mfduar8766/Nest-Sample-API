import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRoot(`mongodb://mongodb`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryAttempts: 3,
      dbName: `${process.env.DB_NAME}`,
    }),
    UsersModule,
  ],
})
export class AppModule {}
