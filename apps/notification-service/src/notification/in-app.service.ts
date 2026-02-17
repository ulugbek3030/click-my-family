import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InAppNotificationEntity } from '../entities/in-app-notification.entity';
import { CacheService, CacheKey } from '@my-family/caching';

@Injectable()
export class InAppService {
  private readonly logger = new Logger(InAppService.name);

  constructor(
    @InjectRepository(InAppNotificationEntity)
    private readonly repo: Repository<InAppNotificationEntity>,
    private readonly cache: CacheService,
  ) {}

  async create(userId: string, title: string, body: string, actionType?: string, actionPayload?: Record<string, unknown>): Promise<InAppNotificationEntity> {
    const notification = this.repo.create({
      userId, title, body,
      actionType: actionType || null,
      actionPayload: actionPayload || null,
    });
    const saved = await this.repo.save(notification);
    await this.cache.del(CacheKey.unreadNotifications(userId));
    return saved;
  }

  async getByUser(userId: string, limit = 20, offset = 0): Promise<InAppNotificationEntity[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' }, take: limit, skip: offset });
  }

  async getUnreadCount(userId: string): Promise<number> {
    const cached = await this.cache.get<number>(CacheKey.unreadNotifications(userId));
    if (cached !== null && cached !== undefined) return cached;
    const count = await this.repo.count({ where: { userId, isRead: false } });
    await this.cache.set(CacheKey.unreadNotifications(userId), count, 60);
    return count;
  }

  async markRead(id: string, userId: string): Promise<void> {
    await this.repo.update({ id, userId }, { isRead: true, readAt: new Date() });
    await this.cache.del(CacheKey.unreadNotifications(userId));
  }

  async markAllRead(userId: string): Promise<void> {
    await this.repo.update({ userId, isRead: false }, { isRead: true, readAt: new Date() });
    await this.cache.del(CacheKey.unreadNotifications(userId));
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.repo.delete({ id, userId });
    await this.cache.del(CacheKey.unreadNotifications(userId));
  }
}
