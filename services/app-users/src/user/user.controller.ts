import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TMessagePayload, USER_EVENTS } from '../common/events';
import { UserService } from './user.service';

@Controller()
export class UserController {
  private _name = UserController.name;

  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_EVENTS.get_users)
  async getUsers(payload: TMessagePayload) {
    console.log(`${this._name} getUsers Payload`, payload);
    return this.userService.getUsers(payload);
  }

  @MessagePattern(USER_EVENTS.get_user)
  async getUser(payload: TMessagePayload) {
    console.log(`${this._name} getUser Payload`, payload);
    return this.userService.getUser(payload);
  }

  @MessagePattern(USER_EVENTS.bulk_insert)
  async handleBulkInsert(payload: TMessagePayload) {
    console.log(`${this._name} handleBulkInsert Payload`, payload);
    return this.userService.handleBulkInsert(payload);
  }

  @MessagePattern(USER_EVENTS.add_user)
  async createUser(payload: TMessagePayload) {
    console.log(`${this._name} createUser Payload`, payload);
    return this.userService.createUser(payload);
  }

  @MessagePattern(USER_EVENTS.update_user)
  async updateUser(payload: TMessagePayload) {
    console.log(`${this._name} updateUser Payload`, payload);
    return this.userService.updateUser(payload);
  }

  @MessagePattern(USER_EVENTS.delete_user)
  async deleteUser(payload: TMessagePayload) {
    console.log(`${this._name} deleteUser Payload`, payload);
    return this.userService.deleteUser(payload);
  }

  @MessagePattern(USER_EVENTS.bulk_delete)
  async handleBulkDelete(payload: TMessagePayload) {
    console.log(`${this._name} handleBulkDelete Payload`, payload);
    return this.userService.handleBulkDelete(payload);
  }
  @MessagePattern(USER_EVENTS.login)
  async getMessage(payload: TMessagePayload) {
    console.log(`${this._name} login payload`, payload);
    return this.userService.loginUser(payload);
  }

  //In case there is a need to end-to-end encrypted message
  @MessagePattern(USER_EVENTS.message)
  async sendMessage(payload: TMessagePayload) {
    console.log(`${this._name} message payload`, payload);
    return this.userService.sendMessage('Modify to send some message');
  }
}
