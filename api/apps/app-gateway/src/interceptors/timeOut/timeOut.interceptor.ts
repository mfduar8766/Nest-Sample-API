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
import { ENV, LOGGER_SERVICE, SharedLoggerService } from '@app/shared-modules';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOGGER_SERVICE)
    private readonly sharedLoggerService: SharedLoggerService,
  ) {
    this.sharedLoggerService.serviceName = TimeoutInterceptor.name;
  }

  private name = TimeoutInterceptor.name;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(
        process.env.NODE_ENV === ENV.DEVELOPMENT
          ? Number(process.env.TIMEOUT)
          : 5000,
      ),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          this.sharedLoggerService.logError({
            message: `${this.name}:timeOutError:${err.message}`,
            method: 'catchError',
          });
          return throwError(new RequestTimeoutException());
        } else {
          this.sharedLoggerService.logError({
            message: `${this.name}:timeOutError:${err.message}`,
            method: 'catchError',
          });
          return throwError(err);
        }
      }),
    );
  }
}
