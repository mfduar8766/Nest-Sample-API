import {
  LOGGER_SERVICE,
  MessagePayload,
  TMessagePayload,
  USER_EVENTS,
  USER_SERVICE,
  UserModelDto,
} from '@app/shared-modules';
import { SharedLoggerService } from '@app/shared-modules/modules/logger/logger.service';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_SERVICE) private readonly usersService: ClientProxy,
    @Inject(LOGGER_SERVICE)
    private readonly sharedLoggerService: SharedLoggerService,
  ) {
    this.sharedLoggerService.setLoggerFileName = UserService.name;
  }

  getUsers() {
    return this.usersService.send<string, TMessagePayload>(
      USER_EVENTS.get_users,
      new MessagePayload(USER_EVENTS.get_users, {}),
    );
  }

  getUser(id: string) {
    return this.usersService.send<string, TMessagePayload>(
      USER_EVENTS.get_user,
      new MessagePayload(USER_EVENTS.get_user, { _id: id }),
    );
  }

  createUser(user: UserModelDto) {
    return this.usersService.send<string, TMessagePayload>(
      USER_EVENTS.add_user,
      new MessagePayload(USER_EVENTS.add_user, { user }),
    );
  }

  handleBulkInsert(users: UserModelDto[]) {
    return this.usersService.send<string, TMessagePayload>(
      USER_EVENTS.bulk_insert,
      new MessagePayload(USER_EVENTS.bulk_insert, { users }),
    );
  }

  updateUser(_id: string, user: UserModelDto) {
    return this.usersService.send<string, TMessagePayload>(
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
    return this.usersService.send<string, TMessagePayload>(
      USER_EVENTS.delete_user,
      new MessagePayload(USER_EVENTS.delete_user, { id }),
    );
  }

  handleBulkDelete(idsToDelete: string[]) {
    return this.usersService.send<string, TMessagePayload>(
      USER_EVENTS.bulk_delete,
      new MessagePayload(USER_EVENTS.bulk_delete, { idsToDelete }),
    );
  }
}
