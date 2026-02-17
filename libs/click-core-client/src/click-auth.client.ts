import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export interface ClickJwtPayload {
  sub: string; // user phone number
  iat: number;
  exp: number;
  roles?: string[];
}

@Injectable()
export class ClickAuthClient {
  private readonly logger = new Logger(ClickAuthClient.name);
  private readonly publicKey: string;

  constructor(private readonly config: ConfigService) {
    this.publicKey = this.config.get('CLICK_JWT_PUBLIC_KEY', '');
  }

  async verifyToken(token: string): Promise<ClickJwtPayload> {
    try {
      // In production, verify JWT using CLICK's RS256 public key
      // For development, we decode without verification
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new UnauthorizedException('Invalid token format');
      }

      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64url').toString('utf-8'),
      );

      // Check expiry
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        throw new UnauthorizedException('Token expired');
      }

      return payload as ClickJwtPayload;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      this.logger.error('Token verification failed', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
