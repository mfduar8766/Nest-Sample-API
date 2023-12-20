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
  SharedModulesService,
  TMessagePayload,
  USER_EVENTS,
  UserModelDto,
} from '@app/shared-modules';

@Controller()
export class AppUsersController {
  constructor(
    private readonly appUsersService: AppUsersService,
    private readonly shareServices: SharedModulesService,
  ) {}

  @MessagePattern(USER_EVENTS.get_users)
  async getUsers(
    @Payload() payload: TMessagePayload,
    @Ctx() context: RmqContext,
  ) {
    console.log(`getUsers(): received payload:${JSON.stringify(payload)}`);
    this.shareServices.handleContextAcknowledgement(context);
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
