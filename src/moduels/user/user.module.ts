import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from 'src/guards/applicationRoles.guard';
import { APP_GUARD } from 'src/models/constants';
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    UserService,
  ],
})
export class UsersModule {}
