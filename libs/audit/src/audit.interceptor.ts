import { Injectable, NestInterceptor, ExecutionContext, CallHandler, SetMetadata } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditService, AuditLogEntry } from './audit.service';

export const AUDIT_ENTITY_TYPE = 'audit:entityType';
export const AUDIT_ACTION = 'audit:action';

export const Audited = (entityType: string, action: AuditLogEntry['action'] = 'CREATE') => {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    SetMetadata(AUDIT_ENTITY_TYPE, entityType)(target, key, descriptor);
    SetMetadata(AUDIT_ACTION, action)(target, key, descriptor);
  };
};

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const entityType = this.reflector.get<string>(AUDIT_ENTITY_TYPE, context.getHandler());
    if (!entityType) return next.handle();

    const action = this.reflector.get<AuditLogEntry['action']>(AUDIT_ACTION, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId || 'unknown';
    const ipAddress = request.ip;
    const userAgent = request.headers?.['user-agent'];

    return next.handle().pipe(
      tap((result: unknown) => {
        const entityId = (result as Record<string, unknown>)?.id as string || 'unknown';
        this.auditService.log({
          userId,
          entityType,
          entityId,
          action: action || 'CREATE',
          newData: result as Record<string, unknown>,
          ipAddress,
          userAgent,
        });
      }),
    );
  }
}
