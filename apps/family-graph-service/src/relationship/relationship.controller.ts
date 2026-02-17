import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CoupleService } from './couple.service';
import { ParentChildService } from './parent-child.service';
import { CreateCoupleRelationshipDto, CreateParentChildDto } from '@my-family/shared-dto';

@Controller()
export class RelationshipController {
  constructor(
    private readonly coupleService: CoupleService,
    private readonly parentChildService: ParentChildService,
  ) {}

  // Couple relationships
  @MessagePattern({ cmd: 'couple.create' })
  async createCouple(@Payload() data: { dto: CreateCoupleRelationshipDto; userId: string }) {
    return this.coupleService.create(data.dto, data.userId);
  }

  @MessagePattern({ cmd: 'couple.findByOwner' })
  async findCouplesByOwner(@Payload() data: { ownerUserId: string }) {
    return this.coupleService.findByOwner(data.ownerUserId);
  }

  @MessagePattern({ cmd: 'couple.update' })
  async updateCouple(@Payload() data: { id: string; dto: Partial<CreateCoupleRelationshipDto>; userId: string }) {
    return this.coupleService.update(data.id, data.dto, data.userId);
  }

  @MessagePattern({ cmd: 'couple.delete' })
  async deleteCouple(@Payload() data: { id: string; userId: string }) {
    return this.coupleService.delete(data.id, data.userId);
  }

  // Parent-child relationships
  @MessagePattern({ cmd: 'parentChild.create' })
  async createParentChild(@Payload() data: { dto: CreateParentChildDto; userId: string }) {
    return this.parentChildService.create(data.dto, data.userId);
  }

  @MessagePattern({ cmd: 'parentChild.findByOwner' })
  async findParentChildByOwner(@Payload() data: { ownerUserId: string }) {
    return this.parentChildService.findByOwner(data.ownerUserId);
  }

  @MessagePattern({ cmd: 'parentChild.delete' })
  async deleteParentChild(@Payload() data: { id: string; userId: string }) {
    return this.parentChildService.delete(data.id, data.userId);
  }
}
