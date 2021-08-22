import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MyLoggerService } from '../logger/logger.service';
import { Users, UsersDocument } from '../../schemas/users.schema';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import {
  LoggerMock,
  usersListMockResults,
  createdUserInstance,
  updatedUser,
  mockDbCalls,
} from '../../mocks/userService.mocks';
import { Model } from 'mongoose';
import { IUsers } from 'src/models/users.interface';

describe('userService', () => {
  let service: UserService;
  let model: Model<UsersDocument>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MyLoggerService,
          useClass: LoggerMock,
        },
        UserService,
        {
          provide: getModelToken(Users.name),
          useValue: mockDbCalls,
        },
        {
          provide: getConnectionToken(),
          useValue: mockDbCalls,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    model = module.get<Model<UsersDocument>>(getModelToken(Users.name));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(usersListMockResults),
    } as any);
    const users = await service.getUsers();
    expect(users).toEqual(usersListMockResults);
  });
  it('should return 1 user', async () => {
    jest.spyOn(model, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(usersListMockResults[0]),
    } as any);
    const users = await service.getUser('1');
    expect(users).toEqual(usersListMockResults[0]);
  });
  it('should create user', async () => {
    const newUser: IUsers = {
      firstName: createdUserInstance.firstName,
      userName: createdUserInstance.userName,
      age: createdUserInstance.age,
      lastName: createdUserInstance.lastName,
      email: createdUserInstance.email,
      password: createdUserInstance.password,
      activationCode: createdUserInstance.activationCode,
      createdAt: createdUserInstance.createdAt,
      updatedAt: createdUserInstance.updatedAt,
      roles: createdUserInstance.roles,
      _id: 'some_id',
    };
    jest.spyOn(model, 'create').mockReturnValueOnce({
      save: jest.fn().mockResolvedValueOnce(newUser),
    } as any);
    const user = await service.createUser(newUser);
    expect(user).toEqual(newUser);
  });
  it('should update a user', async () => {
    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(updatedUser),
    } as any);
    const updatedUserData = await service.updateUser(
      updatedUser._id,
      updatedUser,
    );
    expect(updatedUserData).toEqual(updatedUser);
  });
  it('should delete a user', async () => {
    jest.spyOn(model, 'findByIdAndRemove').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(updatedUser),
    } as any);
    const deletedUser = await service.deleteUser(updatedUser._id);
    expect(deletedUser).toEqual(updatedUser);
  });
});
