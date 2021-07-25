import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { IUsers } from 'src/models/users.interface';
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
  async getUsers() {
    this.logger.log('getUsers()');
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id') userId: string) {
    this.logger.log('getUser()');
    return this.userService.getUser(userId);
  }

  @Post()
  async addUser(@Body() user: IUsers) {
    this.logger.log('addUser()');
    return this.userService.addUser(user);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() user: IUsers) {
    this.logger.log('updateUser()');
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  async deletteUser(@Param('id') userId: string) {
    this.logger.log('deletteUser()');
    return this.userService.deleteUser(userId);
  }
}
