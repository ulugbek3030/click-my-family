import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'transfer', name: 'free_transfer_selection' })
@Index('idx_fts_user', ['userId'])
@Index('idx_fts_active', ['userId', 'isActive'])
export class FreeTransferSelectionEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'varchar', length: 64 })
  userId: string;

  @Column({ name: 'selected_person_id', type: 'uuid' })
  selectedPersonId: string;

  @Column({ name: 'selected_user_id', type: 'varchar', length: 64 })
  selectedUserId: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'selected_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  selectedAt: Date;

  @Column({ name: 'changeable_after', type: 'timestamptz' })
  changeableAfter: Date;

  @Column({ name: 'deactivated_at', type: 'timestamptz', nullable: true })
  deactivatedAt: Date | null;

  @Column({ name: 'deactivation_reason', type: 'varchar', length: 50, nullable: true })
  deactivationReason: string | null;
}
