import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ScheduledNotificationEntity } from '../entities/scheduled-notification.entity';

@Injectable()
export class BirthdayScannerService {
  private readonly logger = new Logger(BirthdayScannerService.name);

  constructor(
    @InjectRepository(ScheduledNotificationEntity)
    private readonly scheduledRepo: Repository<ScheduledNotificationEntity>,
    private readonly dataSource: DataSource,
  ) {}

  @Cron('0 0 * * *', { timeZone: 'Asia/Tashkent' })
  async scanBirthdays(): Promise<void> {
    this.logger.log('Scanning for upcoming birthdays...');

    const daysToCheck = [0, 1, 7];
    for (const daysBefore of daysToCheck) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + daysBefore);
      const month = targetDate.getMonth() + 1;
      const day = targetDate.getDate();

      const persons = await this.dataSource.query(
        `SELECT p.id, p.first_name, p.last_name, p.owner_user_id, p.birth_date
         FROM family_graph.person p
         WHERE p.is_archived = false
           AND p.birth_date IS NOT NULL
           AND p.birth_date_precision = 'full'
           AND EXTRACT(MONTH FROM p.birth_date) = $1
           AND EXTRACT(DAY FROM p.birth_date) = $2`,
        [month, day],
      );

      for (const person of persons) {
        const prefix = daysBefore === 0 ? 'Bugun' : daysBefore === 1 ? 'Ertaga' : `${daysBefore} kundan keyin`;
        const notification = this.scheduledRepo.create({
          recipientUserId: person.owner_user_id,
          title: `${prefix} tug'ilgan kun!`,
          body: `${person.first_name} ${person.last_name || ''} - tug'ilgan kunini unutmang!`,
          channel: 'push',
          notificationType: 'birthday_reminder',
          referenceId: person.id,
          scheduledFor: new Date(),
          status: 'pending',
        });
        await this.scheduledRepo.save(notification);
      }
    }

    this.logger.log('Birthday scan completed');
  }
}
