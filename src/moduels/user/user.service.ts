import { Model } from 'mongoose';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from '../../schemas/users.schema';
import { UserModel } from './userModel';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
  ) {}

  async getUsers(): Promise<Users[]> {
    try {
      const users = await this.userModel.find().exec();
      return users;
    } catch (error) {
      throw new InternalServerErrorException(`Error getting users`);
    }
  }

  async getUser(userId: string): Promise<Users> {
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

  async addUser(user: UserModel): Promise<Users> {
    try {
      const currentUser = await this.userModel
        .findById({ _id: user.id })
        .exec();
      if (currentUser) {
        throw new NotFoundException(
          new Error(`Could not create user: ${user.id} already exists`),
        );
      }
      const newUser = new this.userModel(user);
      newUser.save();
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Could not create user');
    }
  }

  async deleteUser(userId: string): Promise<Users> {
    try {
      const deletedCustomer = await this.userModel.findByIdAndRemove(userId);
      return deletedCustomer;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
