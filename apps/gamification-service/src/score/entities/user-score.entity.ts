import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'gamification', name: 'user_score' })
@Index('idx_user_score_user', ['userId'], { unique: true })
export class UserScoreEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'varchar', length: 64 })
  userId: string;

  @Column({ name: 'total_points', type: 'int', default: 0 })
  totalPoints: number;

  @Column({ name: 'current_level', type: 'int', default: 1 })
  currentLevel: number;

  @Column({ name: 'relatives_added', type: 'int', default: 0 })
  relativesAdded: number;

  @Column({ name: 'relatives_confirmed', type: 'int', default: 0 })
  relativesConfirmed: number;

  @Column({ name: 'max_relatives', type: 'int', default: 100 })
  maxRelatives: number;

  @Column({ name: 'is_premium', type: 'boolean', default: false })
  isPremium: boolean;
}
