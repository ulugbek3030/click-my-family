import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'family_graph', name: 'parent_child' })
@Index('idx_pc_parent', ['parentId'])
@Index('idx_pc_child', ['childId'])
@Index('idx_pc_owner', ['ownerUserId'])
export class ParentChildEntity extends BaseEntity {
  @Column({ name: 'owner_user_id', type: 'varchar', length: 64 })
  ownerUserId: string;

  @Column({ name: 'parent_id', type: 'uuid' })
  parentId: string;

  @Column({ name: 'child_id', type: 'uuid' })
  childId: string;

  @Column({ name: 'relationship_type', type: 'varchar', length: 30, default: 'biological' })
  relationshipType: string;
}
