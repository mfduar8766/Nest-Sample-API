import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ENV } from '../../common/models';
import { MyLoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private logger: MyLoggerService) {}

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
          this.logger.error(`${this.name}:timeOutError:${err.message}`);
          return throwError(new RequestTimeoutException());
        } else {
          this.logger.error(`${this.name}:error:${err.message}`);
          return throwError(err);
        }
      }),
    );
  }
}
