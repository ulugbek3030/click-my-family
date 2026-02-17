import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChangeRequestService } from './change-request.service';

@Controller()
export class ChangeRequestController {
  constructor(private readonly changeRequestService: ChangeRequestService) {}

  @MessagePattern({ cmd: 'changeRequest.create' })
  async create(
    @Payload()
    data: {
      targetPersonId: string;
      treeOwnerUserId: string;
      requesterUserId: string;
      proposedChanges: Record<string, unknown>;
    },
  ) {
    return this.changeRequestService.create(
      data.targetPersonId,
      data.treeOwnerUserId,
      data.requesterUserId,
      data.proposedChanges,
    );
  }

  @MessagePattern({ cmd: 'changeRequest.findByTreeOwner' })
  async findByTreeOwner(@Payload() data: { treeOwnerUserId: string }) {
    return this.changeRequestService.findByTreeOwner(data.treeOwnerUserId);
  }

  @MessagePattern({ cmd: 'changeRequest.approve' })
  async approve(@Payload() data: { id: string; userId: string }) {
    return this.changeRequestService.approve(data.id, data.userId);
  }

  @MessagePattern({ cmd: 'changeRequest.reject' })
  async reject(@Payload() data: { id: string; userId: string }) {
    return this.changeRequestService.reject(data.id, data.userId);
  }
}
