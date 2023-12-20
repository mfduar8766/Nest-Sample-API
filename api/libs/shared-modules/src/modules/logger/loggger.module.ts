import { Module } from '@nestjs/common';
import { SharedLoggerService } from './logger.service';

@Module({
  providers: [SharedLoggerService],
  exports: [SharedLoggerService],
})
export class SharedLoggerModule {}
