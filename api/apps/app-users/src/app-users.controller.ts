import {
  ApplicationRoles,
  RabbitMqService,
  SERVICES,
  TMessagePayload,
  USER_EVENTS,
  UserModelDto,
} from '@app/shared-modules';
import { SharedLoggerService } from '@app/shared-modules/modules/logger/logger.service';
import { Inject, Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppUsersService } from './app-users.service';

@Controller()
export class AppUsersController {
  constructor(
    private readonly appUsersService: AppUsersService,
    private readonly shareServices: RabbitMqService,
    @Inject(SERVICES.LOGGER_SERVICE)
    private readonly logger: SharedLoggerService,
  ) {}

  @MessagePattern(USER_EVENTS.get_users)
  async getUsers(
    @Payload() payload: TMessagePayload,
    @Ctx() context: RmqContext,
  ) {
    this.logger.logInfo({
      message: `Received event: ${payload.event}`,
      method: 'getUsers()',
      value: payload,
    });
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
