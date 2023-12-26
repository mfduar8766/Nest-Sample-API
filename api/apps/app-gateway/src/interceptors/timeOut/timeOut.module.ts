import { Module } from '@nestjs/common';
import { TimeoutInterceptor } from './timeOut.interceptor';
import { SharedLoggerModule } from '@app/shared-modules';

@Module({
  providers: [SharedLoggerModule.createLoggerProvider()],
  exports: [TimeoutInterceptor],
})
export class TimeOutModule {}
