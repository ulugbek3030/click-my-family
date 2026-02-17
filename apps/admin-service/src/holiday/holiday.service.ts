import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HolidayEntity } from './entities/holiday.entity';
import { CreateHolidayDto } from '@my-family/shared-dto';
import { ProducerService } from '@my-family/messaging';
import { CacheService, CacheKey } from '@my-family/caching';
import { ADMIN_EVENTS_EXCHANGE, ADMIN_EVENTS } from '@my-family/common';

@Injectable()
export class HolidayService {
  private readonly logger = new Logger(HolidayService.name);

  constructor(
    @InjectRepository(HolidayEntity)
    private readonly repo: Repository<HolidayEntity>,
    private readonly producer: ProducerService,
    private readonly cache: CacheService,
  ) {}

  async findAll(): Promise<HolidayEntity[]> {
    return this.repo.find({
      where: { isActive: true },
      order: { holidayDate: 'ASC' },
    });
  }

  async findById(id: string): Promise<HolidayEntity> {
    const holiday = await this.repo.findOne({ where: { id } });
    if (!holiday) throw new NotFoundException('Holiday not found');
    return holiday;
  }

  async create(dto: CreateHolidayDto): Promise<HolidayEntity> {
    const holiday = this.repo.create(dto);
    const saved = await this.repo.save(holiday);

    await this.producer.publish(ADMIN_EVENTS_EXCHANGE, ADMIN_EVENTS.HOLIDAY_CREATED, {
      holidayId: saved.id,
      titleUz: saved.titleUz,
      titleRu: saved.titleRu,
      holidayDate: saved.holidayDate,
      targetAudience: saved.targetAudience,
      notifyDaysBefore: saved.notifyDaysBefore,
    });

    await this.cache.del(CacheKey.upcomingHolidays());
    return saved;
  }

  async update(id: string, dto: Partial<CreateHolidayDto>): Promise<HolidayEntity> {
    const holiday = await this.findById(id);
    Object.assign(holiday, dto);
    const saved = await this.repo.save(holiday);
    await this.cache.del(CacheKey.upcomingHolidays());
    return saved;
  }

  async remove(id: string): Promise<void> {
    await this.repo.update(id, { isActive: false });
    await this.cache.del(CacheKey.upcomingHolidays());
  }
}
