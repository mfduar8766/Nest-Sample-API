import {
  MongoDbUsersService,
  SERVICES,
  SharedLoggerService,
  Users,
} from '@app/shared-modules';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppUsersService {
  constructor(
    private readonly mongoUsersService: MongoDbUsersService,
    @Inject(SERVICES.LOGGER_SERVICE)
    private readonly logger: SharedLoggerService,
  ) {}

  async getUsers(): Promise<Users[]> {
    const session = await this.mongoUsersService.startTransaction();
    try {
      await session.commitTransaction();
      return await this.mongoUsersService.getUsers();
    } catch (error) {
      this.logger.logError({
        message: 'Error performing GET users cancling trasaction...',
        value: error,
      });
      await session.abortTransaction();
      throw error;
    }
  }
}
