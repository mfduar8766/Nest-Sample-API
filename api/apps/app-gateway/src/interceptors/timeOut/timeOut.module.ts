import { Module } from '@nestjs/common';
import { TimeoutInterceptor } from './timeOut.interceptor';
import { SharedLoggerModule } from '@app/shared-modules/modules/logger/loggger.module';
import { LOGGER_SERVICE } from '@app/shared-modules';

@Module({
  providers: [
    {
      provide: LOGGER_SERVICE,
      useClass: SharedLoggerModule,
    },
  ],
  exports: [TimeoutInterceptor],
})
export class TimeOutModule {}
