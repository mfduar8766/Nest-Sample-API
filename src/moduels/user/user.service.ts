import { Connection, Model } from 'mongoose';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnApplicationShutdown,
  ShutdownSignal,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from '../../schemas/users.schema';
import { IUsers } from 'src/models/users.interface';
import { MyLoggerService } from '../logger/logger.service';

@Injectable()
export class UserService implements OnApplicationShutdown {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
    @InjectConnection() private connection: Connection,
    private logger: MyLoggerService,
  ) {
    this.logger.prefix = UserService.name;
  }

  async getUsers(): Promise<Users[]> {
    this.logger.log('getUsers()');
    try {
      const users = await this.userModel.find().exec();
      return users;
    } catch (error) {
      throw new InternalServerErrorException(`Error getting users`);
    }
  }

  async getUser(userId: string): Promise<Users> {
    this.checkForUserId(userId);
    this.logger.log('getUser()');
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

  async addUser(user: IUsers): Promise<Users> {
    this.logger.log('addUser()');
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

  async updateUser(userId: string, user: IUsers) {
    this.checkForUserId(user._id);
    this.logger.log('updateUser()');
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

  async deleteUser(userId: string): Promise<Users> {
    this.logger.log('deleteUser()');
    try {
      const deletedCustomer = await this.userModel.findByIdAndRemove(userId);
      return deletedCustomer;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async onApplicationShutdown(signal: string) {
    if (signal == ShutdownSignal.SIGINT) {
      this.logger.log('onApplicationShutdown Recevied Signal: ', signal);
      try {
        this.logger.log('onApplicationShutdown Closing db connection...');
        await this.connection.close();
        this.logger.log('onApplicationShutdown Connection closed.');
      } catch (error) {
        this.logger.error(error);
        throw new InternalServerErrorException(error);
      }
    }
  }

  private checkForUserId(userId: string) {
    if (!userId || userId === null || userId === undefined) {
      throw new HttpException(
        `Cannot update user at userId: ${userId}.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
