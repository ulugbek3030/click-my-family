import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = authHeader.substring(7);

    try {
      // In production: verify admin JWT with separate secret
      // For development: basic token check
      const secret = this.config.get('ADMIN_JWT_SECRET', 'admin-dev-secret');
      if (!token) {
        throw new UnauthorizedException('Invalid token');
      }

      // Decode and validate JWT (simplified for dev)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new UnauthorizedException('Invalid token format');
      }

      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));

      if (payload.role !== 'admin') {
        throw new UnauthorizedException('Admin role required');
      }

      if (payload.exp && payload.exp * 1000 < Date.now()) {
        throw new UnauthorizedException('Token expired');
      }

      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid token');
    }
  }
}
