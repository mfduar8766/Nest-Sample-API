import { Module } from '@nestjs/common';
import { TimeoutInterceptor } from './timeOut.interceptor';
import { SERVICES, SharedLoggerService } from '@app/shared-modules';

@Module({
  providers: [
    {
      provide: SERVICES.LOGGER_SERVICE,
      useFactory: () => new SharedLoggerService(TimeOutModule.name),
    },
  ],
  exports: [TimeoutInterceptor],
})
export class TimeOutModule {}
