import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/schemas/users.schema';
import { LoggerModule } from '../logger/loggger.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    LoggerModule,
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
