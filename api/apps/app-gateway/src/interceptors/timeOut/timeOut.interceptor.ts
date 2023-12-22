import { SERVICES, SharedLoggerService } from '@app/shared-modules';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  Inject,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(
    @Inject(SERVICES.LOGGER_SERVICE)
    private readonly sharedLoggerService: SharedLoggerService,
  ) {
    this.sharedLoggerService.serviceName = TimeoutInterceptor.name;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          this.sharedLoggerService.logError({
            message: `timeOutError`,
            method: 'catchError',
            value: `${JSON.stringify({
              message: err.message,
              stack: err.stack,
            })}`,
          });
          return throwError(new RequestTimeoutException());
        } else if (err) {
          this.sharedLoggerService.logError({
            message: `timeOutError`,
            method: 'catchError',
            value: `${JSON.stringify({
              message: err.message,
              stack: err.stack,
            })}`,
          });
          return throwError(err);
        }
      }),
    );
  }
}
