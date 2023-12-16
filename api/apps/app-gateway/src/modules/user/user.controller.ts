import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Roles } from '../../decorators/applicationRoles.decorators';
<<<<<<< HEAD:api/apps/app-gateway/src/modules/user/user.controller.ts
=======
import { UserModelDto } from '../../common/dto';
import { ApplicationRoles } from '../../common/models';
>>>>>>> 8112c2d71290c0c501d2f16a9dd5b865668014b5:services/app-gateway/src/modules/user/user.controller.ts
import {
  Delete,
  Patch,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { HttpExceptionFilter } from '../../filters/http.exception.filter';
import { TimeoutInterceptor } from '../../interceptors/timeOut/timeOut.interceptor';
import { MyLoggerService } from '../logger/logger.service';
import { UserService } from './user.service';
import { ApplicationRoles, UserModelDto } from '@app/shared-modules';

@Controller('users')
export class UserController {
  private _name = UserController.name;

  constructor(
    private readonly userService: UserService,
    private logger: MyLoggerService,
  ) {}

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
