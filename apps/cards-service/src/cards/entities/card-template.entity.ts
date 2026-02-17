import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@my-family/database';

@Entity({ schema: 'cards', name: 'card_template' })
@Index('idx_ct_category', ['category'])
@Index('idx_ct_active', ['isActive'])
export class CardTemplateEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500 })
  imageUrl: string;

  @Column({ name: 'thumbnail_url', type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string | null;

  @Column({ name: 'is_free', type: 'boolean', default: false })
  isFree: boolean;

  @Column({ name: 'price_tiyin', type: 'bigint', default: 0 })
  priceTiyin: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'holiday_id', type: 'uuid', nullable: true })
  holidayId: string | null;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;
}
