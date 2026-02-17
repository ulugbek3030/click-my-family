import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '@my-family/database';
import { MessagingModule } from '@my-family/messaging';
import { CachingModule } from '@my-family/caching';
import { ClickCoreModule } from '@my-family/click-core-client';
import { ScheduledNotificationEntity } from './entities/scheduled-notification.entity';
import { InAppNotificationEntity } from './entities/in-app-notification.entity';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule.forRoot('notification', [ScheduledNotificationEntity, InAppNotificationEntity]),
    MessagingModule.forRoot({ serviceName: 'notification-service' }),
    CachingModule,
    ClickCoreModule,
    NotificationModule,
  ],
})
export class AppModule {}
