import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'family_graph', name: 'change_request' })
@Index('idx_cr_requester', ['requesterUserId'])
@Index('idx_cr_tree_owner', ['treeOwnerUserId'])
@Index('idx_cr_status', ['status'])
export class ChangeRequestEntity extends BaseEntity {
  @Column({ name: 'requester_user_id', type: 'varchar', length: 64 })
  requesterUserId: string;

  @Column({ name: 'tree_owner_user_id', type: 'varchar', length: 64 })
  treeOwnerUserId: string;

  @Column({ name: 'target_person_id', type: 'uuid' })
  targetPersonId: string;

  @Column({ name: 'proposed_changes', type: 'jsonb' })
  proposedChanges: Record<string, unknown>;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ name: 'reviewer_comment', type: 'text', nullable: true })
  reviewerComment: string | null;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'reviewed_at', type: 'timestamptz', nullable: true })
  reviewedAt: Date | null;
}
