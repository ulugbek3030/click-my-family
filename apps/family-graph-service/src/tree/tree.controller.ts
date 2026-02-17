import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TreeService } from './tree.service';

@Controller()
export class TreeController {
  constructor(private readonly treeService: TreeService) {}

  @MessagePattern({ cmd: 'tree.getFullTree' })
  async getFullTree(@Payload() data: { ownerUserId: string }) {
    return this.treeService.getFullTree(data.ownerUserId);
  }

  @MessagePattern({ cmd: 'tree.getAncestors' })
  async getAncestors(@Payload() data: { ownerUserId: string; personId: string }) {
    return this.treeService.getAncestors(data.ownerUserId, data.personId);
  }

  @MessagePattern({ cmd: 'tree.getDescendants' })
  async getDescendants(@Payload() data: { ownerUserId: string; personId: string }) {
    return this.treeService.getDescendants(data.ownerUserId, data.personId);
  }
}
