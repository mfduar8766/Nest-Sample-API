import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from './userModel';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get('users:userId')
  async getUser(@Param('userId') userId) {
    this.getUser(userId);
  }

  @Post('users')
  async addUser(@Body() user: UserModel) {
    return this.userService.addUser(user);
  }

  @Delete('users:userId')
  async deletteUser(@Query() userId) {
    return this.userService.deleteUser(userId);
  }
}
