import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FreeTransferSelectionEntity } from './entities/free-transfer-selection.entity';
import { CacheService, CacheKey } from '@my-family/caching';
import { TRANSFER_COOLDOWN_DAYS } from '@my-family/common';

@Injectable()
export class SelectionService {
  private readonly logger = new Logger(SelectionService.name);

  constructor(
    @InjectRepository(FreeTransferSelectionEntity)
    private readonly selectionRepo: Repository<FreeTransferSelectionEntity>,
    private readonly cache: CacheService,
  ) {}

  async getActiveSelection(userId: string): Promise<FreeTransferSelectionEntity | null> {
    const cacheKey = CacheKey.transferSelection(userId);
    const cached = await this.cache.get<FreeTransferSelectionEntity>(cacheKey);
    if (cached) return cached;

    const selection = await this.selectionRepo.findOne({
      where: { userId, isActive: true },
    });

    if (selection) {
      await this.cache.set(cacheKey, selection, 3600);
    }
    return selection;
  }

  async selectPerson(
    userId: string,
    selectedPersonId: string,
    selectedUserId: string,
  ): Promise<FreeTransferSelectionEntity> {
    const existing = await this.selectionRepo.findOne({
      where: { userId, isActive: true },
    });

    if (existing) {
      const now = new Date();
      if (now < existing.changeableAfter) {
        const daysLeft = Math.ceil(
          (existing.changeableAfter.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
        throw new BadRequestException(
          `Cannot change selection for ${daysLeft} more days`,
        );
      }

      existing.isActive = false;
      existing.deactivatedAt = now;
      existing.deactivationReason = 'user_changed';
      await this.selectionRepo.save(existing);
    }

    const changeableAfter = new Date();
    changeableAfter.setDate(changeableAfter.getDate() + TRANSFER_COOLDOWN_DAYS);

    const selection = this.selectionRepo.create({
      userId,
      selectedPersonId,
      selectedUserId,
      isActive: true,
      changeableAfter,
    });

    const saved = await this.selectionRepo.save(selection);
    await this.cache.del(CacheKey.transferSelection(userId));

    this.logger.log(`User ${userId} selected person ${selectedPersonId} for free transfer`);
    return saved;
  }

  async deactivateSelection(
    userId: string,
    reason: string,
  ): Promise<void> {
    const selection = await this.selectionRepo.findOne({
      where: { userId, isActive: true },
    });

    if (selection) {
      selection.isActive = false;
      selection.deactivatedAt = new Date();
      selection.deactivationReason = reason;
      await this.selectionRepo.save(selection);
      await this.cache.del(CacheKey.transferSelection(userId));
      this.logger.log(`Deactivated selection for user ${userId}: ${reason}`);
    }
  }

  async deactivateByPersonId(personId: string, reason: string): Promise<void> {
    const selections = await this.selectionRepo.find({
      where: { selectedPersonId: personId, isActive: true },
    });

    for (const selection of selections) {
      selection.isActive = false;
      selection.deactivatedAt = new Date();
      selection.deactivationReason = reason;
      await this.selectionRepo.save(selection);
      await this.cache.del(CacheKey.transferSelection(selection.userId));
    }
  }
}
