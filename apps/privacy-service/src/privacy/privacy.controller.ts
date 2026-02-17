import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PrivacyService } from './privacy.service';
import { PrivacyFilterService } from './privacy-filter.service';

@Controller()
export class PrivacyController {
  constructor(
    private readonly privacyService: PrivacyService,
    private readonly filterService: PrivacyFilterService,
  ) {}

  @MessagePattern({ cmd: 'privacy.getSettings' })
  async getSettings(data: { personId: string; ownerUserId: string }) {
    return this.privacyService.getOrCreate(data.personId, data.ownerUserId);
  }

  @MessagePattern({ cmd: 'privacy.updateSettings' })
  async updateSettings(data: { personId: string; ownerUserId: string; settings: Record<string, boolean> }) {
    return this.privacyService.update(data.personId, data.ownerUserId, data.settings);
  }

  @MessagePattern({ cmd: 'privacy.filterPerson' })
  async filterPerson(data: { person: Record<string, unknown>; viewerUserId: string }) {
    return this.filterService.filterPerson(data.person, data.viewerUserId);
  }

  @MessagePattern({ cmd: 'privacy.filterPersons' })
  async filterPersons(data: { persons: Record<string, unknown>[]; viewerUserId: string }) {
    return Promise.all(
      data.persons.map(person => this.filterService.filterPerson(person, data.viewerUserId)),
    );
  }
}
