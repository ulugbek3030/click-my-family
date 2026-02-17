import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivacySettingsEntity } from './entities/privacy-settings.entity';
import { UpdatePrivacySettingsDto } from '@my-family/shared-dto';
import { CacheService, CacheKey } from '@my-family/caching';

@Injectable()
export class PrivacyService {
  private readonly logger = new Logger(PrivacyService.name);

  constructor(
    @InjectRepository(PrivacySettingsEntity)
    private readonly repo: Repository<PrivacySettingsEntity>,
    private readonly cache: CacheService,
  ) {}

  async getOrCreate(personId: string, ownerUserId: string): Promise<PrivacySettingsEntity> {
    let settings = await this.repo.findOne({ where: { personId } });
    if (!settings) {
      settings = this.repo.create({ personId, ownerUserId });
      settings = await this.repo.save(settings);
    }
    return settings;
  }

  async getByPerson(personId: string): Promise<PrivacySettingsEntity> {
    const settings = await this.repo.findOne({ where: { personId } });
    if (!settings) throw new NotFoundException('Privacy settings not found');
    return settings;
  }

  async update(personId: string, ownerUserId: string, dto: UpdatePrivacySettingsDto): Promise<PrivacySettingsEntity> {
    let settings = await this.getOrCreate(personId, ownerUserId);
    Object.assign(settings, dto);
    settings = await this.repo.save(settings);
    await this.cache.delPattern(`privacy:${personId}:*`);
    return settings;
  }
}
