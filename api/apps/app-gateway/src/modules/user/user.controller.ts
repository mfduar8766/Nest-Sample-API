import {
  ApplicationRoles,
  LOGGER_SERVICE,
  USER_SERVICE,
  UserModelDto,
  SharedLoggerService,
} from '@app/shared-modules';
import {
  Body,
  Controller,
  Get,
  Headers,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  Param,
  Post,
  Put,
  ShutdownSignal,
} from '@nestjs/common';
import {
  Delete,
  Inject,
  Patch,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from '../../decorators/applicationRoles.decorators';
import { HttpExceptionFilter } from '../../filters/http.exception.filter';
import { TimeoutInterceptor } from '../../interceptors/timeOut/timeOut.interceptor';
import { UserService } from './user.service';

@Controller('users')
export class UserController
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private _isConnected = false;

  constructor(
    private readonly userService: UserService,
    @Inject(LOGGER_SERVICE)
    private readonly sharedLoggerService: SharedLoggerService,
    @Inject(USER_SERVICE) private readonly appUsersService: ClientProxy,
  ) {
    this.sharedLoggerService.setLoggerFileName = UserController.name;
  }

  async onApplicationBootstrap() {
    try {
      await this.appUsersService.connect();
      this.sharedLoggerService.logInfo({
        message: `Connected to RabbitMQ`,
        method: 'onApplicationBootstrap',
      });
      this._isConnected = true;
    } catch (error) {
      throw new Error(
        `Error connecting to app-users:${JSON.stringify(error)}...`,
      );
    }
  }

  onApplicationShutdown(signal?: string) {
    if (signal === ShutdownSignal.SIGTERM || signal === ShutdownSignal.SIGINT) {
      if (this._isConnected) {
        this.appUsersService.close();
        this._isConnected = false;
      }
    }
  }

  @Get()
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(TimeoutInterceptor)
  async getUsers() {
    this.sharedLoggerService.logInfo({
      message: 'Received request on getUsers()',
      method: 'getUsers()',
    });
    try {
      return this.userService.getUsers();
    } catch (error) {
      this.sharedLoggerService.logError({
        message: `Error on getUsers`,
        method: 'getUsers()',
        value: error,
      });
      return error;
    }
  }

  @Get(':id')
  @Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER)
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(TimeoutInterceptor)
  async getUser(@Param('id') id: string) {
    this.sharedLoggerService.logInfo({
      message: 'Received request on getUser()',
      method: 'getUser()',
    });
    try {
      return this.userService.getUser(id);
    } catch (error) {
      this.sharedLoggerService.logError({
        message: `Error on getUser`,
        method: 'getUser()',
        value: error,
      });
    }
  }

  @Post()
  @Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER)
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(TimeoutInterceptor)
  async createUser(
    @Headers('bulk-insert') bulkInsert: boolean,
    @Body() user: UserModelDto,
    @Body() users: UserModelDto[],
  ): Promise<any> {
    this.sharedLoggerService.logInfo({
      message: 'Received request on createUser()',
      method: 'createUser()',
    });
    if (bulkInsert && users.length) {
      try {
        return this.userService.handleBulkInsert(users);
      } catch (error) {
        this.sharedLoggerService.logError({
          message: `Error on handleBulkInsert`,
          method: 'handleBulkInsert()',
          value: error,
        });
      }
    }
    try {
      return this.userService.createUser(user);
    } catch (error) {
      this.sharedLoggerService.logError({
        message: `Error on createUser`,
        method: 'createUser()',
        value: error,
      });
    }
  }

  @Put(':id')
  @Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER)
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(TimeoutInterceptor)
  async updateUser(@Param('id') id: string, @Body() user: UserModelDto) {
    this.sharedLoggerService.logInfo({
      message: 'Received request on updateUser()',
      method: 'updateUser()',
    });
    try {
      return this.userService.updateUser(id, user);
    } catch (error) {
      this.sharedLoggerService.logError({
        message: `Error on updateUser`,
        method: 'updateUser()',
        value: error,
      });
    }
  }

  @Patch(':id/change-password')
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(TimeoutInterceptor)
  handleChangePassword(@Param('id') id: string, @Body() user: UserModelDto) {
    this.sharedLoggerService.logInfo({
      message: 'Received request on handleChangePassword()',
      method: 'handleChangePassword()',
    });
    try {
      return this.userService.handleChangePassword(id, user);
    } catch (error) {
      this.sharedLoggerService.logError({
        message: `Error on handleChangePassword`,
        method: 'handleChangePassword()',
        value: error,
      });
    }
  }

  @Delete(':id')
  @Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER)
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(TimeoutInterceptor)
  async deleteUser(
    @Param('id') id: string,
    @Headers('bulk-delete') bulkDelete: boolean,
    @Headers('id-list') idsToDelete: string[],
  ): Promise<any> {
    this.sharedLoggerService.logInfo({
      message: 'Received request on deleteUser()',
      method: 'deleteUser()',
    });
    if (bulkDelete && idsToDelete.length) {
      try {
        return this.userService.handleBulkDelete(idsToDelete);
      } catch (error) {
        this.sharedLoggerService.logError({
          message: `Error on handleBulkDelete`,
          method: 'handleBulkDelete()',
          value: error,
        });
      }
    }
    try {
      return this.userService.deleteUser(id);
    } catch (error) {
      this.sharedLoggerService.logError({
        message: `Error on deleteUser`,
        method: 'deleteUser()',
        value: error,
      });
    }
  }
}
