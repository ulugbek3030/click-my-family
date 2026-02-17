import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request?.method || 'RPC';
    const url = request?.url || context.getHandler().name;

    return next.handle().pipe(
      tap(() => {
        this.logger.debug(`${method} ${url} - ${Date.now() - now}ms`);
      }),
    );
  }
}
