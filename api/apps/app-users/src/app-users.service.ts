import { MongoDbUsersService, Users } from '@app/shared-modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppUsersService {
  constructor(private readonly mongoUsersService: MongoDbUsersService) {}

  async getUsers(): Promise<Users[]> {
    return await this.mongoUsersService.getUsers();
  }
}
