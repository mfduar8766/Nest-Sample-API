import {
  MessagePayload,
  USER_EVENTS,
  UserModelDto,
  SERVICES,
  SharedLoggerService,
} from '@app/shared-modules';
import { TUSER_EVENTS } from '@app/shared-modules/common/events';
import { createMessagePayload } from '@app/shared-modules/utils';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @Inject(SERVICES.USER_SERVICE) private readonly usersService: ClientProxy,
    @Inject(SERVICES.LOGGER_SERVICE)
    private readonly sharedLoggerService: SharedLoggerService,
  ) {
    this.sharedLoggerService.setLoggerFileName = UserService.name;
  }

  getUsers() {
    return this.usersService.send<TUSER_EVENTS, MessagePayload>(
      USER_EVENTS.get_users,
      createMessagePayload('get_users', {}),
    );
  }

  getUser(id: string) {
    return this.usersService.send<TUSER_EVENTS, MessagePayload>(
      USER_EVENTS.get_user,
      new MessagePayload(USER_EVENTS.get_user, { _id: id }),
    );
  }

  createUser(user: UserModelDto) {
    return this.usersService.send<TUSER_EVENTS, MessagePayload>(
      USER_EVENTS.add_user,
      new MessagePayload(USER_EVENTS.add_user, { user }),
    );
  }

  handleBulkInsert(users: UserModelDto[]) {
    return this.usersService.send<TUSER_EVENTS, MessagePayload>(
      USER_EVENTS.bulk_insert,
      new MessagePayload(USER_EVENTS.bulk_insert, { users }),
    );
  }

  updateUser(_id: string, user: UserModelDto) {
    return this.usersService.send<TUSER_EVENTS, MessagePayload>(
      USER_EVENTS.update_user,
      new MessagePayload(USER_EVENTS.update_user, { _id, user }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleChangePassword(id: string, user: UserModelDto) {
    this.sharedLoggerService.logWarn({
      message: 'Method Not Implemented',
      method: 'handleChangePassword()',
    });
  }

  deleteUser(id: string) {
    return this.usersService.send<TUSER_EVENTS, MessagePayload>(
      USER_EVENTS.delete_user,
      new MessagePayload(USER_EVENTS.delete_user, { id }),
    );
  }

  handleBulkDelete(idsToDelete: string[]) {
    return this.usersService.send<TUSER_EVENTS, MessagePayload>(
      USER_EVENTS.bulk_delete,
      new MessagePayload(USER_EVENTS.bulk_delete, { idsToDelete }),
    );
  }
}
