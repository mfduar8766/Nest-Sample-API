import { Module, Provider, Scope } from '@nestjs/common';
import { SharedLoggerService } from './logger.service';
import { SERVICES } from '@app/shared-modules/common';

@Module({
  providers: [SharedLoggerService],
  exports: [SharedLoggerService],
})
export class SharedLoggerModule {
  static createLoggerProvider(): Provider {
    return {
      provide: SERVICES.LOGGER_SERVICE,
      useFactory: () => new SharedLoggerService(),
      scope: Scope.TRANSIENT,
    };
  }
}
