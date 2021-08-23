import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserModelDto } from '../dto/users.dto';
import { ApplicationRoles } from '../models/applicationRoles';
import { IUsers } from '../models/users.interface';
import { Users } from '../schemas/users.schema';

export class LoggerMock {
  log(message: any, ...optionalParams: any[]) {
    console.log(message, optionalParams.toString());
  }
}

export const usersListMockResults: Users[] = [
  {
    userName: '',
    firstName: 'John',
    age: 29,
    lastName: 'Doe',
    email: 'john@gmail.com',
    password: 'testpassword21!',
    activationCode: '',
    createdAt: new Date(),
    updatedAt: null,
    roles: [ApplicationRoles.SUPER_USER, ApplicationRoles.ADMIN],
  },
];
export const usersMock = [
  {
    _id: '1',
    roles: ['ADMIN', 'SUPER_USER'],
    userName: '',
    firstName: 'John',
    lastName: 'Doe',
    age: 29,
    email: 'john@gmail.com',
    password: 'testPassword21!',
    createdAt: Date.now(),
    updatedAt: null,
    activationCode: '',
  },
  {
    _id: '2',
    roles: ['ADMIN'],
    userName: '',
    firstName: 'Jane',
    lastName: 'Doe',
    age: 29,
    email: 'jane@gmail.com',
    password: 'testIIPassword21!',
    createdAt: Date.now(),
    updatedAt: null,
    activationCode: '',
  },
];
export const createdUserInstance: Users = {
  roles: [ApplicationRoles.USER],
  userName: '',
  firstName: 'John',
  lastName: 'Doe',
  age: 29,
  email: 'john@gmail.com',
  password: 'testPassword21!',
  createdAt: new Date(),
  updatedAt: null,
  activationCode: '',
};

export const createdUser: UserModelDto = {
  _id: '3',
  roles: [ApplicationRoles.USER],
  userName: '',
  firstName: 'John',
  lastName: 'Doe',
  age: 29,
  email: 'john@gmail.com',
  password: 'testPassword21!',
  createdAt: new Date(),
  updatedAt: null,
  activationCode: '',
};

export const updatedUser: UserModelDto = {
  ...createdUser,
  userName: 'updated',
};

export const getUserError = (id: string) => {
  throw new HttpException('User id does not exist.', HttpStatus.NOT_FOUND);
};

export const mockUserService = {
  getUsers: jest.fn().mockResolvedValue(Promise.resolve(usersListMockResults)),
  getUser: jest.fn().mockImplementation((id: string) => {
    if (!id || id === '' || id === undefined || id === null) {
      getUserError(id);
    } else {
      return Promise.resolve(usersListMockResults[0]);
    }
  }),
  createUser: jest.fn().mockImplementation((user: UserModelDto) => {
    if (user && user !== null && user !== undefined) {
      return Promise.resolve(createdUserInstance);
    } else {
      throw new HttpException(
        {
          message: `Cannot create user`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }),
  handleBulkInsert: jest.fn().mockImplementation((users: IUsers[]) =>
    Promise.resolve({
      ok: 2,
      n: 2,
    }),
  ),
  updateUser: jest.fn().mockImplementation((id: string, user: IUsers) => {
    if (id === '3') {
      return Promise.resolve(updatedUser);
    } else {
      throw new InternalServerErrorException(
        { error: 'err' },
        'Could not update user.',
      );
    }
  }),
  deleteUser: jest
    .fn()
    .mockImplementation((id: string) => Promise.resolve(updatedUser)),
  handleBulkDelete: jest.fn().mockImplementation((idsToDelete: string[]) =>
    Promise.resolve({
      ok: 2,
      n: 2,
    }),
  ),
  handleChangePassword: jest.fn().mockReturnValue(true),
};

export const mockDbCalls = {
  find: jest.fn(),
  findById: jest.fn(),
  insertMany: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndRemove: jest.fn(),
  close: jest.fn().mockResolvedValue(Promise.resolve()),
  exec: jest.fn(),
};
