import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@my-family/database';
import { MessagingModule } from '@my-family/messaging';
import { CachingModule } from '@my-family/caching';
import { ClickCoreModule } from '@my-family/click-core-client';
import { TransferModule } from './transfer/transfer.module';
import { FreeTransferSelectionEntity } from './transfer/entities/free-transfer-selection.entity';
import { TransferLogEntity } from './transfer/entities/transfer-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot('transfer', [FreeTransferSelectionEntity, TransferLogEntity]),
    MessagingModule.forRoot({ serviceName: 'transfer-service' }),
    CachingModule,
    ClickCoreModule,
    TransferModule,
  ],
})
export class AppModule {}
