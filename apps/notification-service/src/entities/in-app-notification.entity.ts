import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'notification', name: 'in_app_notification' })
@Index('idx_inapp_user', ['userId'])
@Index('idx_inapp_read', ['userId', 'isRead'])
export class InAppNotificationEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'varchar', length: 64 })
  userId: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ name: 'action_type', type: 'varchar', length: 50, nullable: true })
  actionType: string | null;

  @Column({ name: 'action_payload', type: 'jsonb', nullable: true })
  actionPayload: Record<string, unknown> | null;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', type: 'timestamptz', nullable: true })
  readAt: Date | null;
}
