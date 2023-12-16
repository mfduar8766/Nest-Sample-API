import { Module } from '@nestjs/common';
import { AppUsersController } from './app-users.controller';
import { AppUsersService } from './app-users.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./.env.development.local'],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AppUsersController],
  providers: [AppUsersService],
})
export class AppUsersModule {}
