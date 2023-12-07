import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE } from '../../models/constants';
import { USER_EVENTS } from '../../events';
import { MyLoggerService } from '../logger/logger.service';
import { IMessagePayload } from '../../models/message-payload.interface';
import { MessagePayload } from '../../dto/MessagePayload.dto';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
      .send<string, IMessagePayload>(
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
}
