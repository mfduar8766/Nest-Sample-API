import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from '../../guards/applicationRoles.guard';
import { APP_GUARD } from '../../models/constants';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MyLoggerService } from '../logger/logger.service';
import {
  LoggerMock,
  mockUserService,
  usersListMockResults,
  createdUserInstance,
  createdUser,
  updatedUser,
} from '../../mocks/userService.mocks';

describe('userController', () => {
  let controller: UserController;
  let service: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: MyLoggerService,
          useClass: LoggerMock,
        },
        {
          provide: UserService,
          useClass: LoggerMock,
        },
      ],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should have a controller defined', () => {
    expect(controller).toBeDefined();
  });
  it('should have a service defined', () => {
    expect(service).toBeDefined();
  });
  it('should return a list of users', async () => {
    jest
      .spyOn(service, 'getUsers')
      .mockImplementation(() => Promise.resolve(usersListMockResults));
    expect(await controller.getUsers()).toEqual(usersListMockResults);
  });
  it('should return one user', async () => {
    jest
      .spyOn(service, 'getUser')
      .mockImplementation((id: string) =>
        Promise.resolve(usersListMockResults[0]),
      );
    expect(await controller.getUser('1')).toEqual(usersListMockResults[0]);
  });
  it('should create a user', async () => {
    expect(await controller.createUser(false, createdUser, null)).toEqual(
      createdUserInstance,
    );
  });
  it('should create multiple users', async () => {
    expect(
      await controller.createUser(true, null, [
        createdUser,
        { ...createdUser, firstName: 'Bob' },
      ]),
    ).toEqual({ ok: 2, n: 2 });
  });
  it('should update user', async () => {
    expect(await controller.updateUser('3', updatedUser)).toEqual(updatedUser);
  });
  it('should delete user', async () => {
    expect(await controller.deleteUser('3', false, [])).toEqual(updatedUser);
  });
  it('should delete multiple users', async () => {
    expect(await controller.deleteUser('', true, ['1', '2'])).toEqual({
      ok: 2,
      n: 2,
    });
  });
  it('should change password', () => {
    expect(controller.handleChangePassword('3', createdUser)).toEqual(true);
  });
});
