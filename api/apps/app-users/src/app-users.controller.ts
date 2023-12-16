import { Controller } from '@nestjs/common';
import { AppUsersService } from './app-users.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  ApplicationRoles,
  USER_EVENTS,
  UserModelDto,
} from '@app/shared-modules';

@Controller()
export class AppUsersController {
  constructor(private readonly appUsersService: AppUsersService) {}

  @MessagePattern(USER_EVENTS.get_users)
  async getUsers() {
    console.log('Received request');
    return [
      new UserModelDto(
        'bob22',
        'bob',
        'doe',
        'bob@gmail.com',
        '123',
        23,
        [ApplicationRoles.SUPER_USER],
        new Date(Date.now()),
        null,
        '',
      ),
    ]; //this.appUsersService.getHello();
  }
}
