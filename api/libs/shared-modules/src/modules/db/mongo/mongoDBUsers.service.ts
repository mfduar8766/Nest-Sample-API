import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ShutdownSignal,
} from '@nestjs/common';
import { Users, UsersDocument } from './schemas/users.schema';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Schema } from 'mongoose';
import { SERVICES, TUsers } from '@app/shared-modules/common';
import { SharedLoggerService } from '../../logger/logger.service';

@Injectable()
export class MongoDbUsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
    @InjectConnection() private connection: Connection,
    @Inject(SERVICES.LOGGER_SERVICE)
    private readonly logger: SharedLoggerService,
  ) {
    this.logger.serviceName = MongoDbUsersService.name;
  }

  async getUsers(): Promise<Users[]> {
    this.logger.logInfo({ message: 'getUsers()' });
    try {
      const users = await this.userModel.find().exec();
      return users;
    } catch (error) {
      throw new InternalServerErrorException(`Error getting users`);
    }
  }

  async getUser(userId: Schema.Types.ObjectId): Promise<Users> {
    this.checkForUserId(userId);
    this.logger.logInfo({ message: 'getUser()' });
    try {
      const user = await this.userModel.findById({ _id: userId }).exec();
      if (!user) {
        throw new NotFoundException(`User #${userId} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(`User #${userId} not found`);
    }
  }

  async addUser(user: TUsers): Promise<Users> {
    this.logger.logInfo({ message: 'addUser()' });
    try {
      const currentUser = await this.userModel
        .findById({ _id: user._id })
        .exec();
      if (currentUser) {
        throw new HttpException(
          `Cannot create user: ${user._id}. User already exists.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const newUser = new this.userModel(user);
      return await newUser.save();
    } catch (error) {
      throw new InternalServerErrorException(error, 'Could not create user');
    }
  }

  async updateUser(userId: string, user: TUsers) {
    this.checkForUserId(user._id);
    this.logger.logInfo({ message: 'updateUser()' });
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate({ _id: userId }, user)
        .exec();
      if (!updatedUser) {
        throw new HttpException(
          `Cannot update user: ${user._id}. User not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Could not update user.');
    }
  }

  async deleteUser(userId: string): Promise<{ deleted: boolean; value: any }> {
    this.logger.logInfo({ message: 'deleteUser()' });
    try {
      const deletedCustomer = await this.userModel
        .findByIdAndDelete(userId)
        .exec();
      if (deletedCustomer.ok) {
        return { deleted: true, value: deletedCustomer.value };
      } else {
        return { deleted: false, value: userId };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async onApplicationShutdown(signal: string) {
    if (signal == ShutdownSignal.SIGINT) {
      this.logger.logInfo({
        message: 'onApplicationShutdown Recevied Signal:',
        value: signal,
      });
      try {
        this.logger.logInfo({
          message: 'onApplicationShutdown Closing db connection...',
        });
        await this.connection.close();
        this.logger.logInfo({
          message: 'onApplicationShutdown Connection closed',
        });
      } catch (error) {
        this.logger.error(error);
        throw new InternalServerErrorException(error);
      }
    }
  }

  private checkForUserId(userId: Schema.Types.ObjectId) {
    if (!userId || userId === null || userId === undefined) {
      throw new HttpException(
        `Cannot update user at userId: ${userId}.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
