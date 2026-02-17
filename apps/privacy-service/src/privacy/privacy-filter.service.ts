import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivacySettingsEntity } from './entities/privacy-settings.entity';
import { CacheService, CacheKey } from '@my-family/caching';

@Injectable()
export class PrivacyFilterService {
  private readonly logger = new Logger(PrivacyFilterService.name);

  constructor(
    @InjectRepository(PrivacySettingsEntity)
    private readonly repo: Repository<PrivacySettingsEntity>,
    private readonly cache: CacheService,
  ) {}

  async filterPerson(person: Record<string, unknown>, viewerUserId: string): Promise<Record<string, unknown>> {
    const personId = person.id as string;
    const ownerUserId = person.ownerUserId as string;

    if (ownerUserId === viewerUserId) return person;
    if (person.linkedUserId === viewerUserId) return person;

    const cacheKey = CacheKey.privacy(personId, viewerUserId);
    const cached = await this.cache.get<Record<string, unknown>>(cacheKey);
    if (cached) return cached;

    const settings = await this.repo.findOne({ where: { personId } });
    const filtered = { ...person };

    if (!settings || !settings.sharePhoto) delete filtered.photoUrl;
    if (!settings || !settings.sharePhone) delete filtered.phone;
    if (!settings || !settings.shareAddress) {
      delete filtered.addressText;
      delete filtered.addressLat;
      delete filtered.addressLng;
    }
    if (!settings || !settings.shareSocial) delete filtered.socialLinks;
    if (!settings || !settings.shareNotes) delete filtered.notes;
    if (!settings || !settings.shareBirthDate) {
      delete filtered.birthDate;
      filtered.birthDatePrecision = 'unknown';
    }

    await this.cache.set(cacheKey, filtered, 300);
    return filtered;
  }
}
