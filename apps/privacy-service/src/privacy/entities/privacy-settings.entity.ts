import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'privacy', name: 'privacy_settings' })
@Index('idx_privacy_person', ['personId'], { unique: true })
@Index('idx_privacy_owner', ['ownerUserId'])
export class PrivacySettingsEntity extends BaseEntity {
  @Column({ name: 'person_id', type: 'uuid' })
  personId: string;

  @Column({ name: 'owner_user_id', type: 'varchar', length: 64 })
  ownerUserId: string;

  @Column({ name: 'share_photo', type: 'boolean', default: false })
  sharePhoto: boolean;

  @Column({ name: 'share_phone', type: 'boolean', default: false })
  sharePhone: boolean;

  @Column({ name: 'share_address', type: 'boolean', default: false })
  shareAddress: boolean;

  @Column({ name: 'share_social', type: 'boolean', default: false })
  shareSocial: boolean;

  @Column({ name: 'share_notes', type: 'boolean', default: false })
  shareNotes: boolean;

  @Column({ name: 'share_birth_date', type: 'boolean', default: false })
  shareBirthDate: boolean;
}
