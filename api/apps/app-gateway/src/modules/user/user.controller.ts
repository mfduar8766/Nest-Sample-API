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
import { Roles } from '../../decorators/applicationRoles.decorators';
import {
  Delete,
  Inject,
  Patch,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { HttpExceptionFilter } from '../../filters/http.exception.filter';
import { TimeoutInterceptor } from '../../interceptors/timeOut/timeOut.interceptor';
import { MyLoggerService } from '../logger/logger.service';
import { UserService } from './user.service';
import {
  ApplicationRoles,
  USER_SERVICE,
  UserModelDto,
} from '@app/shared-modules';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
export class UserController
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private _name = UserController.name;
  private _isConnected = false;

  constructor(
    private readonly userService: UserService,
    private logger: MyLoggerService,
    @Inject(USER_SERVICE) private readonly appUsersService: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    try {
      const connected = await this.appUsersService.connect();
      this.logger.log(`Connected to RabbitMQ`, JSON.stringify(connected));
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
    this.logger.log(`${this._name} getUsers()`);
    try {
      return this.userService.getUsers();
    } catch (error) {
      this.logger.error(`${this._name}:getUsers():${JSON.stringify(error)}`);
      return error;
    }
  }

  @Get(':id')
  @Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER)
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(TimeoutInterceptor)
  async getUser(@Param('id') id: string) {
    this.logger.log(`${this._name} getUser()`);
    try {
      return this.userService.getUser(id);
    } catch (error) {
      this.logger.error(`${this._name}:getUser():${JSON.stringify(error)}`);
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
    this.logger.log(`${this._name} createUser()`);
    if (bulkInsert && users.length) {
      try {
        return this.userService.handleBulkInsert(users);
      } catch (error) {
        this.logger.error(
          `${this._name}:createUser():${JSON.stringify(error)}`,
        );
      }
    }
    try {
      return this.userService.createUser(user);
    } catch (error) {
      this.logger.error(`${this._name}:createUser():${JSON.stringify(error)}`);
    }
  }

  @Put(':id')
  @Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER)
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(TimeoutInterceptor)
  async updateUser(@Param('id') id: string, @Body() user: UserModelDto) {
    this.logger.log(`${this._name} updateUser()`);
    try {
      return this.userService.updateUser(id, user);
    } catch (error) {
      this.logger.error(`${this._name}:updateUser():${JSON.stringify(error)}`);
    }
  }

  @Patch(':id/change-password')
  @UseFilters(HttpExceptionFilter)
  @UseInterceptors(TimeoutInterceptor)
  handleChangePassword(@Param('id') id: string, @Body() user: UserModelDto) {
    this.logger.log(`${this._name} handleChangePassword()`);
    try {
      return this.userService.handleChangePassword(id, user);
    } catch (error) {
      this.logger.error(
        `${this._name}:handleChangePassword():${JSON.stringify(error)}`,
      );
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
    this.logger.log(`${this._name} deleteUser()`);
    if (bulkDelete && idsToDelete.length) {
      try {
        return this.userService.handleBulkDelete(idsToDelete);
      } catch (error) {
        this.logger.error(
          `${this._name}:handleBulkDelete():${JSON.stringify(error)}`,
        );
      }
    }
    try {
      return this.userService.deleteUser(id);
    } catch (error) {
      this.logger.error(`${this._name}:deleteUser():${JSON.stringify(error)}`);
    }
  }
}
