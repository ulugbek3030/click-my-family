import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'cards', name: 'sent_card' })
@Index('idx_sc_sender', ['senderUserId'])
@Index('idx_sc_receiver', ['receiverUserId'])
@Index('idx_sc_template', ['templateId'])
export class SentCardEntity extends BaseEntity {
  @Column({ name: 'sender_user_id', type: 'varchar', length: 64 })
  senderUserId: string;

  @Column({ name: 'receiver_user_id', type: 'varchar', length: 64 })
  receiverUserId: string;

  @Column({ name: 'receiver_person_id', type: 'uuid' })
  receiverPersonId: string;

  @Column({ name: 'template_id', type: 'uuid' })
  templateId: string;

  @Column({ name: 'personal_message', type: 'text', nullable: true })
  personalMessage: string | null;

  @Column({ name: 'is_paid', type: 'boolean', default: false })
  isPaid: boolean;

  @Column({ name: 'payment_amount_tiyin', type: 'bigint', default: 0 })
  paymentAmountTiyin: number;

  @Column({ name: 'click_payment_id', type: 'varchar', length: 255, nullable: true })
  clickPaymentId: string | null;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', type: 'timestamptz', nullable: true })
  readAt: Date | null;
}
