import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledNotificationEntity } from '../entities/scheduled-notification.entity';
import { InAppNotificationEntity } from '../entities/in-app-notification.entity';
import { BirthdayScannerService } from './birthday-scanner.service';
import { NotificationDispatcherService } from './notification-dispatcher.service';
import { InAppService } from './in-app.service';
import { NotificationController } from './notification.controller';
import { FamilyEventsConsumer } from './consumers/family-events.consumer';
import { CardEventsConsumer } from './consumers/card-events.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduledNotificationEntity, InAppNotificationEntity])],
  providers: [BirthdayScannerService, NotificationDispatcherService, InAppService, FamilyEventsConsumer, CardEventsConsumer],
  controllers: [NotificationController],
})
export class NotificationModule {}
