import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'gamification', name: 'level_definition' })
@Index('idx_level_def_level', ['level'], { unique: true })
export class LevelDefinitionEntity extends BaseEntity {
  @Column({ type: 'int' })
  level: number;

  @Column({ name: 'min_points', type: 'int' })
  minPoints: number;

  @Column({ name: 'name_uz', type: 'varchar', length: 100 })
  nameUz: string;

  @Column({ name: 'name_ru', type: 'varchar', length: 100 })
  nameRu: string;

  @Column({ name: 'icon_url', type: 'text', nullable: true })
  iconUrl: string | null;

  @Column({ type: 'jsonb', default: '{}' })
  benefits: Record<string, unknown>;
}
