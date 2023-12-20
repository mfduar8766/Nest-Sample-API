import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MyLoggerService } from '../logger/logger.service';
import {
  UserModelDto,
  MessagePayload,
  USER_SERVICE,
  USER_EVENTS,
  TMessagePayload,
} from '@app/shared-modules';

@Injectable()
export class UserService {
  private _name = UserService.name;

  constructor(
    @Inject(USER_SERVICE) private readonly usersService: ClientProxy,
    private readonly logger: MyLoggerService,
  ) {}

  getUsers() {
    this.logger.log(`${this._name} getUsers()`);
    return this.usersService.send<string, TMessagePayload>(
      USER_EVENTS.get_users,
      new MessagePayload(USER_EVENTS.get_users, {}),
    );
  }

  getUser(id: string) {
    this.logger.log(`${this._name} getUsers()`);
    return this.usersService.send<string, TMessagePayload>(
      USER_EVENTS.get_user,
      new MessagePayload(USER_EVENTS.get_user, { _id: id }),
    );
  }

  createUser(user: UserModelDto) {
    this.logger.log(`${this._name} createUser()`);
    return this.usersService.send<string, TMessagePayload>(
      USER_EVENTS.add_user,
      new MessagePayload(USER_EVENTS.add_user, { user }),
    );
  }

  handleBulkInsert(users: UserModelDto[]) {
    this.logger.log(`${this._name} handleBulkInsert()`);
    return this.usersService.send<string, TMessagePayload>(
      USER_EVENTS.bulk_insert,
      new MessagePayload(USER_EVENTS.bulk_insert, { users }),
    );
  }

  updateUser(_id: string, user: UserModelDto) {
    this.logger.log(`${this._name} updateUser()`);
    return this.usersService.send<string, TMessagePayload>(
      USER_EVENTS.update_user,
      new MessagePayload(USER_EVENTS.update_user, { _id, user }),
    );
  }

  handleChangePassword(id: string, user: UserModelDto) {
    this.logger.log(`${id}, ${user} Method Not Implemented`);
  }

  deleteUser(id: string) {
    this.logger.log(`${this._name} deleteUser()`);
    return this.usersService.send<string, TMessagePayload>(
      USER_EVENTS.delete_user,
      new MessagePayload(USER_EVENTS.delete_user, { id }),
    );
  }

  handleBulkDelete(idsToDelete: string[]) {
    this.logger.log(`${this._name} handleBulkDelete()`);
    return this.usersService.send<string, TMessagePayload>(
      USER_EVENTS.bulk_delete,
      new MessagePayload(USER_EVENTS.bulk_delete, { idsToDelete }),
    );
  }
}
