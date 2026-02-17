import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity({ schema: 'admin', name: 'holiday' })
export class HolidayEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title_uz', type: 'varchar', length: 200 })
  titleUz: string;

  @Column({ name: 'title_ru', type: 'varchar', length: 200 })
  titleRu: string;

  @Column({ name: 'description_uz', type: 'text', nullable: true })
  descriptionUz: string | null;

  @Column({ name: 'description_ru', type: 'text', nullable: true })
  descriptionRu: string | null;

  @Column({ name: 'holiday_date', type: 'date' })
  @Index()
  holidayDate: Date;

  @Column({ name: 'is_recurring', type: 'boolean', default: true })
  isRecurring: boolean;

  @Column({ name: 'icon_url', type: 'text', nullable: true })
  iconUrl: string | null;

  @Column({ name: 'banner_url', type: 'text', nullable: true })
  bannerUrl: string | null;

  @Column({ name: 'target_audience', type: 'varchar', length: 30, default: 'all' })
  targetAudience: string;

  @Column({ name: 'target_criteria', type: 'jsonb', nullable: true })
  targetCriteria: Record<string, unknown> | null;

  @Column({ name: 'notify_days_before', type: 'int', array: true, default: '{7,1,0}' })
  notifyDaysBefore: number[];

  @Column({ name: 'notification_title_uz', type: 'text', nullable: true })
  notificationTitleUz: string | null;

  @Column({ name: 'notification_title_ru', type: 'text', nullable: true })
  notificationTitleRu: string | null;

  @Column({ name: 'notification_body_uz', type: 'text', nullable: true })
  notificationBodyUz: string | null;

  @Column({ name: 'notification_body_ru', type: 'text', nullable: true })
  notificationBodyRu: string | null;

  @Column({ name: 'cta_action', type: 'varchar', length: 30, nullable: true })
  ctaAction: string | null;

  @Column({ name: 'cta_payload', type: 'jsonb', nullable: true })
  ctaPayload: Record<string, unknown> | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
