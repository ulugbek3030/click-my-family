import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'notification', name: 'scheduled_notification' })
@Index('idx_scheduled_notif_date', ['scheduledFor'])
@Index('idx_scheduled_notif_status', ['status'])
export class ScheduledNotificationEntity extends BaseEntity {
  @Column({ name: 'recipient_user_id', type: 'varchar', length: 64 })
  recipientUserId: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', length: 50 })
  channel: string;

  @Column({ name: 'notification_type', type: 'varchar', length: 50 })
  notificationType: string;

  @Column({ name: 'reference_id', type: 'varchar', length: 255, nullable: true })
  referenceId: string | null;

  @Column({ name: 'scheduled_for', type: 'timestamptz' })
  scheduledFor: Date;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ name: 'sent_at', type: 'timestamptz', nullable: true })
  sentAt: Date | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;
}
