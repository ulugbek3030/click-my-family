import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'transfer', name: 'transfer_log' })
@Index('idx_tl_sender', ['senderUserId'])
@Index('idx_tl_receiver', ['receiverUserId'])
export class TransferLogEntity extends BaseEntity {
  @Column({ name: 'sender_user_id', type: 'varchar', length: 64 })
  senderUserId: string;

  @Column({ name: 'receiver_user_id', type: 'varchar', length: 64 })
  receiverUserId: string;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'UZS' })
  currency: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ name: 'click_transaction_id', type: 'varchar', length: 255, nullable: true })
  clickTransactionId: string | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;
}
