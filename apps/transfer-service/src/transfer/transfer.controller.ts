import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SelectionService } from './selection.service';
import { ExecutionService } from './execution.service';

@Controller()
export class TransferController {
  constructor(
    private readonly selectionService: SelectionService,
    private readonly executionService: ExecutionService,
  ) {}

  @MessagePattern({ cmd: 'transfer.getSelection' })
  async getSelection(@Payload() data: { userId: string }) {
    return this.selectionService.getActiveSelection(data.userId);
  }

  @MessagePattern({ cmd: 'transfer.selectPerson' })
  async selectPerson(
    @Payload() data: { userId: string; selectedPersonId: string; selectedUserId: string },
  ) {
    return this.selectionService.selectPerson(
      data.userId,
      data.selectedPersonId,
      data.selectedUserId,
    );
  }

  @MessagePattern({ cmd: 'transfer.execute' })
  async executeTransfer(
    @Payload() data: { userId: string; amount: number; currency?: string },
  ) {
    return this.executionService.executeTransfer(data.userId, data.amount, data.currency);
  }

  @MessagePattern({ cmd: 'transfer.history' })
  async getHistory(@Payload() data: { userId: string; page?: number; limit?: number }) {
    return this.executionService.getTransferHistory(data.userId, data.page, data.limit);
  }
}
