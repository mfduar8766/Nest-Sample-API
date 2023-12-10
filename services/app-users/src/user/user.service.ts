import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ShutdownSignal,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { MessagePayload } from '../../../common/dto/MessagePayload.dto';
import {
  TMessagePayload,
  USER_EVENTS,
  TUSER_EVENTS,
} from '../../../common/events';
import { Users, UsersDocument } from '../schemas/users.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
  ) {}

  private _name = UserService.name;
  private _responsePayload: TMessagePayload;

  async getUsers(payload: TMessagePayload): Promise<TMessagePayload> {
    console.log(`${this._name} getUsers Payload`, payload);
    this.createResponseObject('get_users');
    try {
      const users = await this.userModel.find().exec();
      this._responsePayload.response = { users: [...users] };
      console.log(
        `${this._name} getUsers Response`,
        JSON.stringify(this._responsePayload),
      );
      return this._responsePayload;
    } catch (error) {
      console.error(`${this._name} getUsers Error`, error);
      this._responsePayload.error = { error };
      return this._responsePayload;
    }
  }

  async getUser(payload: TMessagePayload): Promise<TMessagePayload> {
    this.checkForUserId(payload.params._id);
    console.log(`${this._name} getUser(): Req: ${JSON.stringify(payload)}`);
    this.createResponseObject('get_user');
    try {
      const user = await this.userModel
        .findById(payload.params._id)
        .lean()
        .exec();
      if (!user) {
        throw new NotFoundException(`User #${payload?.params?.id} not found`);
      }
      this._responsePayload.response = { ...user };
      console.log(
        `${this._name} getUsers Response`,
        JSON.stringify(this._responsePayload),
      );
      return this._responsePayload;
    } catch (error) {
      throw new InternalServerErrorException(
        `User #${payload?.params?.id} not found`,
      );
    }
  }

  async handleBulkInsert(payload: TMessagePayload): Promise<TMessagePayload> {
    console.log(`${this._name} handleBulkInsert()`);
    if (!payload.params.users.length) {
      throw new HttpException(
        {
          error: 'Cannot bulk insert empty list',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      const newUsersList = await this.userModel.collection.insertMany(
        payload.params.users,
      );
      if (newUsersList.result.ok) {
        this.createResponseObject('bulk_insert');
        this._responsePayload.response = {
          usersAdded: newUsersList.result.ok,
          numberAdded: newUsersList.result.n,
        };
      }
      return this._responsePayload;
    } catch (error) {
      throw new HttpException(
        {
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(payload: TMessagePayload): Promise<TMessagePayload> {
    console.log(`${this._name} createUser()`);
    if (payload.params?.user) {
      try {
        const createdUser = await (
          await this.userModel.create(payload.params.user)
        ).save();
        this.createResponseObject('add_user');
        this._responsePayload.response = { ...createdUser };
        return this._responsePayload;
      } catch (error) {
        throw new HttpException(
          {
            message: `Cannot create user: ${payload.params?.user}.`,
            error,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    throw new HttpException(
      {
        message: `Cannot create user`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async updateUser(payload: TMessagePayload): Promise<TMessagePayload> {
    this.checkForUserId(payload?.params?._id);
    console.log(`${this._name} updateUser()`);
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate({ _id: payload?.params?._id }, payload?.params?.user)
        .exec();
      if (!updatedUser) {
        throw new HttpException(
          `Cannot update user: ${payload?.params?._id}. User not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      this.createResponseObject('update_user');
      this._responsePayload.response = { ...updatedUser };
      return this._responsePayload;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Could not update user.');
    }
  }

  async deleteUser(payload: TMessagePayload): Promise<TMessagePayload> {
    console.log(`${this._name} deleteUser()`);
    try {
      const deletedCustomer = await this.userModel
        .findByIdAndRemove(payload?.params?.id)
        .exec();
      this.createResponseObject('delete_user');
      this._responsePayload.response = { ...deletedCustomer };
      return this._responsePayload;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async handleBulkDelete(payload: TMessagePayload): Promise<TMessagePayload> {
    console.log(`${this._name} handleBulkDelete()`);
    try {
      const deleteIds = await this.userModel.collection.deleteMany({
        _id: { $in: payload?.params?.idsToDelete },
      });
      if (deleteIds.result.ok) {
        this.createResponseObject('bulk_delete');
        this._responsePayload.response = {
          deletedUsers: deleteIds.result.ok,
          numberDeleted: deleteIds.result.n,
        };
      }
      return this._responsePayload;
    } catch (error) {
      throw new HttpException(
        {
          message: `Cannot delete ids: ${payload?.params?.idsToDelete}.`,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  handleChangePassword(payload: TMessagePayload): boolean {
    console.log(`${this._name} handleChangePassword()`);
    console.log(`${this._name} handleChangePassword User:`, payload);
    return true;
  }

  private createResponseObject(event: TUSER_EVENTS) {
    this._responsePayload = new MessagePayload(USER_EVENTS[event], null, {});
  }

  private checkForUserId(payload: string) {
    if (
      ['', undefined, null].includes(payload) ||
      ['', undefined, null].includes(payload)
    ) {
      throw new HttpException('User id does not exist.', HttpStatus.NOT_FOUND);
    }
  }

  public async onApplicationShutdown(signal: string) {
    if (signal === ShutdownSignal.SIGINT || signal === ShutdownSignal.SIGTERM) {
      console.log(
        `${this._name} onApplicationShutdown Recevied Signal: ${signal}`,
      );
      try {
        console.log('onApplicationShutdown Closing db connection...');
        await this.connection.close();
        console.log('onApplicationShutdown Connection closed.');
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(error);
      }
    }
  }
}
