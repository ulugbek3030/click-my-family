import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeTransferSelectionEntity } from './entities/free-transfer-selection.entity';
import { TransferLogEntity } from './entities/transfer-log.entity';
import { SelectionService } from './selection.service';
import { ExecutionService } from './execution.service';
import { TransferController } from './transfer.controller';
import { FamilyEventsConsumer } from './consumers/family-events.consumer';
import { GamificationEventsConsumer } from './consumers/gamification-events.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([FreeTransferSelectionEntity, TransferLogEntity])],
  providers: [SelectionService, ExecutionService, FamilyEventsConsumer, GamificationEventsConsumer],
  controllers: [TransferController],
})
export class TransferModule {}
