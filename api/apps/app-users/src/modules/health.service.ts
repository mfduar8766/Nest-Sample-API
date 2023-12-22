import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async getHealth() {
    return HttpStatus.OK;
  }
}
