import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class IdempotencyService {
  private readonly logger = new Logger(IdempotencyService.name);
  private redis: Redis;
  private readonly TTL_SECONDS = 86400; // 24 hours

  constructor(private readonly config: ConfigService) {
    this.redis = new Redis({
      host: this.config.get('REDIS_HOST', 'localhost'),
      port: this.config.get<number>('REDIS_PORT', 6379),
      keyPrefix: 'idempotency:',
    });
  }

  async isProcessed(eventId: string): Promise<boolean> {
    const result = await this.redis.exists(eventId);
    return result === 1;
  }

  async markProcessed(eventId: string): Promise<void> {
    await this.redis.setex(eventId, this.TTL_SECONDS, '1');
  }
}
