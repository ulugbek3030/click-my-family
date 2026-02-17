import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'family_graph', name: 'person' })
@Index('idx_person_owner', ['ownerUserId'])
@Index('idx_person_linked', ['linkedUserId'])
@Index('idx_person_phone', ['phone'])
export class PersonEntity extends BaseEntity {
  @Column({ name: 'owner_user_id', type: 'varchar', length: 64 })
  ownerUserId: string;

  @Column({ name: 'linked_user_id', type: 'varchar', length: 64, nullable: true })
  linkedUserId: string | null;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName: string | null;

  @Column({ name: 'middle_name', type: 'varchar', length: 100, nullable: true })
  middleName: string | null;

  @Column({ name: 'maiden_name', type: 'varchar', length: 100, nullable: true })
  maidenName: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: string | null;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ name: 'birth_date_precision', type: 'varchar', length: 20, default: 'unknown' })
  birthDatePrecision: string;

  @Column({ name: 'is_alive', type: 'boolean', default: true })
  isAlive: boolean;

  @Column({ name: 'death_date', type: 'date', nullable: true })
  deathDate: Date | null;

  @Column({ name: 'death_date_precision', type: 'varchar', length: 20, default: 'unknown' })
  deathDatePrecision: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'address_text', type: 'text', nullable: true })
  addressText: string | null;

  @Column({ name: 'address_lat', type: 'decimal', precision: 9, scale: 6, nullable: true })
  addressLat: number | null;

  @Column({ name: 'address_lng', type: 'decimal', precision: 9, scale: 6, nullable: true })
  addressLng: number | null;

  @Column({ name: 'photo_url', type: 'text', nullable: true })
  photoUrl: string | null;

  @Column({ name: 'social_links', type: 'jsonb', nullable: true })
  socialLinks: Record<string, string> | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'is_confirmed', type: 'boolean', default: false })
  isConfirmed: boolean;

  @Column({ name: 'confirmed_at', type: 'timestamptz', nullable: true })
  confirmedAt: Date | null;

  @Column({ name: 'is_archived', type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ name: 'archived_at', type: 'timestamptz', nullable: true })
  archivedAt: Date | null;
}
