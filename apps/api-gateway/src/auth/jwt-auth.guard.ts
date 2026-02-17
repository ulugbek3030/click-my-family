import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ClickAuthClient } from '@my-family/click-core-client';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly clickAuth: ClickAuthClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = authHeader.substring(7);

    try {
      const payload = await this.clickAuth.verifyToken(token);
      request.user = {
        userId: payload.sub,
        roles: payload.roles || [],
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
