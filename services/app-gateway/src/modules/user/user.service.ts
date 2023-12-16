import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { USER_EVENTS } from '../../common/events';
import { TMessagePayload, USER_SERVICE } from '../../common/models';
import { MyLoggerService } from '../logger/logger.service';
import { UserModelDto, MessagePayload } from '../../common/dto';

@Injectable()
export class UserService {
  private _name = UserService.name;

  constructor(
    @Inject(USER_SERVICE) private client: ClientProxy,
    private logger: MyLoggerService,
  ) {}

  getUsers() {
    this.logger.log(`${this._name} getUsers()`);
    return this.client
      .send<string, TMessagePayload>(
        USER_EVENTS.get_users,
        new MessagePayload(USER_EVENTS.get_users, {}),
      )
      .pipe(
        map((data) => {
          this.logger.log(
            `${this._name} getUsers():Received data: ${JSON.stringify(data)}`,
          );
          return data;
        }),
        catchError((err) => throwError(err)),
      );
  }

  getUser(id: string) {
    this.logger.log(`${this._name} getUsers()`);
    return this.client
      .send<string, TMessagePayload>(
        USER_EVENTS.get_user,
        new MessagePayload(USER_EVENTS.get_user, { _id: id }),
      )
      .pipe(
        map((data) => {
          this.logger.log(
            `${this._name} getUser():Received data: ${JSON.stringify(data)}`,
          );
          return data;
        }),
        catchError((err) => throwError(err)),
      );
  }

  createUser(user: UserModelDto) {
    this.logger.log(`${this._name} createUser()`);
    return this.client
      .send<string, TMessagePayload>(
        USER_EVENTS.add_user,
        new MessagePayload(USER_EVENTS.add_user, user),
      )
      .pipe(
        map((data) => {
          this.logger.log(
            `${this._name} createUser():Received data: ${JSON.stringify(data)}`,
          );
          return data;
        }),
        catchError((err) => throwError(err)),
      );
  }

  handleBulkInsert(users: UserModelDto[]) {
    this.logger.log(`${this._name} handleBulkInsert()`);
    return this.client
      .send<string, TMessagePayload>(
        USER_EVENTS.bulk_insert,
        new MessagePayload(USER_EVENTS.bulk_insert, { users }),
      )
      .pipe(
        map((data) => {
          this.logger.log(
            `${this._name} handleBulkInsert():Received data: ${JSON.stringify(
              data,
            )}`,
          );
          return data;
        }),
        catchError((err) => throwError(err)),
      );
  }

  updateUser(_id: string, user: UserModelDto) {
    this.logger.log(`${this._name} updateUser()`);
    return this.client
      .send<string, TMessagePayload>(
        USER_EVENTS.update_user,
        new MessagePayload(USER_EVENTS.update_user, { _id, user }),
      )
      .pipe(
        map((data) => {
          this.logger.log(
            `${this._name} updateUser():Received data: ${JSON.stringify(data)}`,
          );
          return data;
        }),
        catchError((err) => throwError(err)),
      );
  }

  handleChangePassword(id: string, user: UserModelDto) {
    this.logger.log(`${id}, ${user} Method Not Implemented`);
  }

  deleteUser(id: string) {
    this.logger.log(`${this._name} deleteUser()`);
    return this.client
      .send<string, TMessagePayload>(
        USER_EVENTS.delete_user,
        new MessagePayload(USER_EVENTS.delete_user, { id }),
      )
      .pipe(
        map((data) => {
          this.logger.log(
            `${this._name} deleteUser():Received data: ${JSON.stringify(data)}`,
          );
          return data;
        }),
        catchError((err) => throwError(err)),
      );
  }

  handleBulkDelete(idsToDelete: string[]) {
    this.logger.log(`${this._name} handleBulkDelete()`);
    return this.client
      .send<string, TMessagePayload>(
        USER_EVENTS.bulk_delete,
        new MessagePayload(USER_EVENTS.bulk_delete, { idsToDelete }),
      )
      .pipe(
        map((data) => {
          this.logger.log(
            `${this._name} handleBulkDelete():Received data: ${JSON.stringify(
              data,
            )}`,
          );
          return data;
        }),
        catchError((err) => throwError(err)),
      );
  }
}
