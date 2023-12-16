import { Injectable } from '@nestjs/common';

@Injectable()
export class AppUsersService {
  getHello(): string {
    return 'Hello World!';
  }
}
