import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'gamification', name: 'points_history' })
@Index('idx_points_history_user', ['userId'])
export class PointsHistoryEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'varchar', length: 64 })
  userId: string;

  @Column({ name: 'points_delta', type: 'int' })
  pointsDelta: number;

  @Column({ type: 'varchar', length: 100 })
  reason: string;

  @Column({ name: 'reference_id', type: 'varchar', length: 255, nullable: true })
  referenceId: string | null;
}
