import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MapService } from './map.service';

@Controller()
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @MessagePattern({ cmd: 'map.getRelatives' })
  async getRelativesMap(@Payload() data: { ownerUserId: string }) {
    return this.mapService.getRelativesMap(data.ownerUserId);
  }
}
