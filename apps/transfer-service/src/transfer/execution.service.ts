import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferLogEntity } from './entities/transfer-log.entity';
import { SelectionService } from './selection.service';
import { ClickTransferClient } from '@my-family/click-core-client';
import { DEFAULT_TRANSFER_LIMIT_TIYIN } from '@my-family/common';

@Injectable()
export class ExecutionService {
  private readonly logger = new Logger(ExecutionService.name);

  constructor(
    @InjectRepository(TransferLogEntity)
    private readonly transferLogRepo: Repository<TransferLogEntity>,
    private readonly selectionService: SelectionService,
    private readonly clickTransfer: ClickTransferClient,
  ) {}

  async executeTransfer(
    senderUserId: string,
    amount: number,
    currency: string = 'UZS',
  ): Promise<TransferLogEntity> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    if (amount > DEFAULT_TRANSFER_LIMIT_TIYIN) {
      throw new BadRequestException('Amount exceeds transfer limit');
    }

    const selection = await this.selectionService.getActiveSelection(senderUserId);
    if (!selection) {
      throw new BadRequestException('No active free transfer selection found');
    }

    const log = this.transferLogRepo.create({
      senderUserId,
      receiverUserId: selection.selectedUserId,
      amount,
      currency,
      status: 'pending',
    });
    const savedLog = await this.transferLogRepo.save(log);

    try {
      const result = await this.clickTransfer.executeTransfer({
        fromUserId: senderUserId,
        toUserId: selection.selectedUserId,
        amount,
        description: `Family transfer ${savedLog.id}`,
      });

      savedLog.clickTransactionId = result.transactionId;
      savedLog.status = 'completed';
      savedLog.completedAt = new Date();
      await this.transferLogRepo.save(savedLog);

      this.logger.log(
        `Transfer ${savedLog.id} completed: ${senderUserId} -> ${selection.selectedUserId}, amount: ${amount}`,
      );
    } catch (error) {
      savedLog.status = 'failed';
      savedLog.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.transferLogRepo.save(savedLog);

      this.logger.error(`Transfer ${savedLog.id} failed: ${savedLog.errorMessage}`);
      throw new BadRequestException('Transfer failed. Please try again later.');
    }

    return savedLog;
  }

  async getTransferHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: TransferLogEntity[]; total: number }> {
    const [items, total] = await this.transferLogRepo.findAndCount({
      where: [{ senderUserId: userId }, { receiverUserId: userId }],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total };
  }
}
