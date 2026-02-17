import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const ownerUserId = request.params?.ownerUserId || request.body?.ownerUserId;

    if (ownerUserId && userId !== ownerUserId) {
      throw new ForbiddenException('You can only access your own resources');
    }

    return true;
  }
}
