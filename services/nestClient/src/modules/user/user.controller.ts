import {
  // Body,
  Get,
  Controller,
  // Delete,
  // Headers,
  // Param,
  // Patch,
  // Post,
  // Put,
} from '@nestjs/common';
// import { Roles } from '../../decorators/applicationRoles.decorators';
// import { UserModelDto } from '../../dto/users.dto';
// import { ApplicationRoles } from '../../models/applicationRoles';
// import { Users, UsersDocument } from '../../schemas/users.schema';
import { MyLoggerService } from '../logger/logger.service';
import { UserService } from './user.service';
import { UseFilters, UseInterceptors } from '@nestjs/common/decorators';
import { HttpExceptionFilter } from '../..//filters/http.exception.filter';
import { map } from 'rxjs/operators';
import { TimeoutInterceptor } from '../../interceptors/timeOut/timeOut.interceptor';

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
  async getUsers(): Promise<any> {
    this.logger.log(`${this._name} getUsers()`);
    try {
      return this.userService.getUsers().pipe(
        map((data) => {
          return data;
        }),
      );
    } catch (error) {
      this.logger.error(`${this._name}:getUsers():${JSON.stringify(error)}`);
      return error;
    }
  }

  // @Get(':id')
  // async getUser(@Param('id') id: string): Promise<Users> {
  //   this.logger.log(`${this._name} getUser()`);
  //   return this.userService.getUser(id);
  // }

  // @Post()
  // @Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER)
  // async createUser(
  //   @Headers('bulk-insert') bulkInsert: boolean,
  //   @Body() user: UserModelDto,
  //   @Body() users: UserModelDto[],
  // ): Promise<any> {
  //   this.logger.log(`${this._name} createUser()`);
  //   if (bulkInsert && users.length) {
  //     return this.userService.handleBulkInsert(users);
  //   }
  //   return this.userService.createUser(user);
  // }

  // @Put(':id')
  // @Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER)
  // async updateUser(
  //   @Param('id') id: string,
  //   @Body() user: UserModelDto,
  // ): Promise<UsersDocument> {
  //   this.logger.log(`${this._name} updateUser()`);
  //   return this.userService.updateUser(id, user);
  // }

  // @Patch(':id/change-password')
  // handleChangePassword(
  //   @Param('id') id: string,
  //   @Body() user: UserModelDto,
  // ): boolean {
  //   this.logger.log(`${this._name} handleChangePassword()`);
  //   return this.userService.handleChangePassword(id, user);
  // }

  // @Delete(':id')
  // @Roles(ApplicationRoles.ADMIN, ApplicationRoles.SUPER_USER)
  // async deleteUser(
  //   @Param('id') id: string,
  //   @Headers('bulk-delete') bulkDelete: boolean,
  //   @Headers('id-list') idsToDelete: string[],
  // ): Promise<any> {
  //   this.logger.log(`${this._name} deleteUser()`);
  //   if (bulkDelete && idsToDelete.length) {
  //     return this.userService.handleBulkDelete(idsToDelete);
  //   }
  //   return this.userService.deleteUser(id);
  // }
}
