import { Controller } from '@nestjs/common';
import { AppUsersService } from './app-users.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  ApplicationRoles,
  TMessagePayload,
  USER_EVENTS,
  UserModelDto,
} from '@app/shared-modules';

@Controller()
export class AppUsersController {
  constructor(private readonly appUsersService: AppUsersService) {}

  @MessagePattern(USER_EVENTS.get_users)
  async getUsers(
    @Payload() payload: TMessagePayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    console.log(
      `Received Request:${JSON.stringify({
        message,
        payload,
      })}`,
    );
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
    ];
  }
}
