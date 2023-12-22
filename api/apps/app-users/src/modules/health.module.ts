import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { SERVICES, SharedLoggerService } from '@app/shared-modules';

@Module({
  controllers: [HealthController],
  providers: [
    HealthService,
    {
      provide: SERVICES.LOGGER_SERVICE,
      useFactory: () => new SharedLoggerService(HealthCheckModule.name),
    },
  ],
  exports: [HealthService],
})
export class HealthCheckModule {}
