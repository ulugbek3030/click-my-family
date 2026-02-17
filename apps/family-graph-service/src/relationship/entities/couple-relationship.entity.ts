import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'family_graph', name: 'couple_relationship' })
@Index('idx_couple_persons', ['personAId', 'personBId'])
@Index('idx_couple_owner', ['ownerUserId'])
export class CoupleRelationshipEntity extends BaseEntity {
  @Column({ name: 'owner_user_id', type: 'varchar', length: 64 })
  ownerUserId: string;

  @Column({ name: 'person_a_id', type: 'uuid' })
  personAId: string;

  @Column({ name: 'person_b_id', type: 'uuid' })
  personBId: string;

  @Column({ name: 'relationship_type', type: 'varchar', length: 30 })
  relationshipType: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date | null;

  @Column({ name: 'start_date_precision', type: 'varchar', length: 20, default: 'unknown' })
  startDatePrecision: string;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ name: 'end_date_precision', type: 'varchar', length: 20, default: 'unknown' })
  endDatePrecision: string;

  @Column({ name: 'marriage_place', type: 'varchar', length: 255, nullable: true })
  marriagePlace: string | null;
}
