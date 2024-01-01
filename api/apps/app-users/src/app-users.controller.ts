import {
  RabbitMqService,
  SERVICES,
  TMessagePayload,
  USER_EVENTS,
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
import { createMessagePayload } from '@app/shared-modules/utils';

@Controller()
export class AppUsersController {
  constructor(
    private readonly shareServices: RabbitMqService,
    @Inject(SERVICES.LOGGER_SERVICE)
    private readonly logger: SharedLoggerService,
    private readonly userService: AppUsersService,
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
    try {
      const users = await this.userService.getUsers();
      return createMessagePayload(payload.event, undefined, {
        result: 'success',
        data: users,
      });
    } catch (error) {
      this.logger.logError({
        message: 'Error getting users',
        value: `${error}`,
      });
    }
  }
}
