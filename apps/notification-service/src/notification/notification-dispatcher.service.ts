import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { ScheduledNotificationEntity } from '../entities/scheduled-notification.entity';
import { ClickPushClient } from '@my-family/click-core-client';
import { InAppService } from './in-app.service';

@Injectable()
export class NotificationDispatcherService {
  private readonly logger = new Logger(NotificationDispatcherService.name);

  constructor(
    @InjectRepository(ScheduledNotificationEntity)
    private readonly scheduledRepo: Repository<ScheduledNotificationEntity>,
    private readonly pushClient: ClickPushClient,
    private readonly inAppService: InAppService,
  ) {}

  @Cron('* * * * *')
  async dispatch(): Promise<void> {
    const pending = await this.scheduledRepo.find({
      where: { status: 'pending', scheduledFor: LessThanOrEqual(new Date()) },
      take: 100,
      order: { scheduledFor: 'ASC' },
    });

    for (const notification of pending) {
      try {
        if (notification.channel === 'push' || notification.channel === 'both') {
          await this.pushClient.sendPush({
            userId: notification.recipientUserId,
            title: notification.title,
            body: notification.body,
          });
        }
        if (notification.channel === 'in_app' || notification.channel === 'both') {
          await this.inAppService.create(
            notification.recipientUserId,
            notification.title,
            notification.body,
            notification.notificationType,
            notification.referenceId ? { referenceId: notification.referenceId } : undefined,
          );
        }
        notification.status = 'sent';
        notification.sentAt = new Date();
      } catch (error) {
        notification.status = 'failed';
        notification.errorMessage = (error as Error).message;
        this.logger.error(`Failed to dispatch notification ${notification.id}`, error);
      }
      await this.scheduledRepo.save(notification);
    }
  }
}
