import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Roles } from 'src/decorators/applicationRoles.decorators';
import { UserModelDto } from 'src/dto/users.dto';
import { ApplicationRoles } from 'src/models/applicationRoles';
import { IUsers } from 'src/models/users.interface';
import { Users } from '../../schemas/users.schema';
import { MyLoggerService } from '../logger/logger.service';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private logger: MyLoggerService,
  ) {
    this.logger.prefix = UserController.name;
  }

  @Get()
  async getUsers(): Promise<Users[]> {
    this.logger.log('getUsers()');
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id') userId: string): Promise<Users> {
    this.logger.log('getUser()');
    return this.userService.getUser(userId);
  }

  @Post()
  @Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER)
  async createUser(
    @Headers('bulk-insert') bulkInsert: boolean,
    @Body() user: UserModelDto,
    @Body() users: UserModelDto[],
  ): Promise<any> {
    this.logger.log('createUser()');
    if (bulkInsert && users.length) {
      return this.userService.handleBulkInsert(users);
    }
    return this.userService.createUser(user);
  }

  @Put(':id')
  @Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER)
  async updateUser(@Param('id') id: string, @Body() user: UserModelDto) {
    this.logger.log('updateUser()');
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  @Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER)
  async deletteUser(@Param('id') userId: string): Promise<IUsers> {
    this.logger.log('deletteUser()');
    return this.userService.deleteUser(userId);
  }
}
