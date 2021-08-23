import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesGuard } from '../../guards/applicationRoles.guard';
import { APP_GUARD } from '../../models/constants';
import { Users, UsersSchema } from '../../schemas/users.schema';
import { MyLoggerService } from '../logger/logger.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
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
