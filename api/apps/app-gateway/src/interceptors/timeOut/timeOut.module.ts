import { Module } from '@nestjs/common';
import { MyLoggerService } from '../../modules/logger/logger.service';
import { TimeoutInterceptor } from './timeOut.interceptor';

@Module({
  providers: [MyLoggerService],
  exports: [TimeoutInterceptor],
})
export class TimeOutModule {}
