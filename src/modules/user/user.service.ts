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
import { MyLoggerService } from '../logger/logger.service';
import { IUsers } from '../../models/users.interface';
import { UserModelDto } from 'src/dto/users.dto';

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

  async getUser(id: string): Promise<Users> {
    this.checkForUserId(id);
    this.logger.log('getUser()');
    try {
      const user = await this.userModel.findById({ _id: id }).exec();
      if (!user) {
        throw new NotFoundException(`User #${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(`User #${id} not found`);
    }
  }

  async handleBulkInsert(users: IUsers[]): Promise<{
    ok: number;
    n: number;
  }> {
    this.logger.log('handleBulkInsert()');
    try {
      const newUsersList = await this.userModel.collection.insertMany(users);
      return newUsersList.result;
    } catch (error) {
      throw new HttpException(
        {
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(user: UserModelDto): Promise<Users> {
    this.logger.log('createUser()');
    console.log('USER: ', user);
    if (user && user !== null && user !== undefined) {
      try {
        return await (await this.userModel.create(user)).save();
      } catch (error) {
        throw new HttpException(
          {
            message: `Cannot create user: ${user}.`,
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

  async updateUser(id: string, user: IUsers) {
    this.checkForUserId(user._id);
    this.logger.log('updateUser()');
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate({ _id: id }, user)
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

  async deleteUser(id: string): Promise<Users> {
    this.logger.log('deleteUser()');
    try {
      const deletedCustomer = await this.userModel.findByIdAndRemove(id).exec();
      return deletedCustomer;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async handleBulkDelete(idsToDelete: string[]): Promise<{
    ok?: number;
    n?: number;
  }> {
    this.logger.log('handleBulkDelete()');
    try {
      const deleteIds = await this.userModel.collection.deleteMany({
        _id: { $in: idsToDelete },
      });
      return deleteIds.result;
    } catch (error) {
      throw new HttpException(
        {
          message: `Cannot delete ids: ${idsToDelete}.`,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  handleChangePassword(id: string, user: IUsers): boolean {
    this.logger.log('handleChangePassword()');
    this.logger.log('handleChangePassword user: ', user);
    this.checkForUserId(id);
    return true;
  }

  private checkForUserId(id: string) {
    if (id === '' || id === null || id === undefined) {
      throw new HttpException('User id does not exist.', HttpStatus.NOT_FOUND);
    }
  }

  public async onApplicationShutdown(signal: string) {
    if (signal === ShutdownSignal.SIGINT || signal === ShutdownSignal.SIGTERM) {
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
}
