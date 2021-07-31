import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { UserModelDto } from 'src/dto/users.dto';
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
  async addUser(@Body() user: UserModelDto): Promise<Users> {
    this.logger.log('addUser()');
    return this.userService.addUser(user);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() user: UserModelDto) {
    this.logger.log('updateUser()');
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  async deletteUser(@Param('id') userId: string): Promise<IUsers> {
    this.logger.log('deletteUser()');
    return this.userService.deleteUser(userId);
  }
}
