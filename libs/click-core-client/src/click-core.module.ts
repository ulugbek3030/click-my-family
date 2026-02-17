import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClickAuthClient } from './click-auth.client';
import { ClickTransferClient } from './click-transfer.client';
import { ClickPaymentClient } from './click-payment.client';
import { ClickPushClient } from './click-push.client';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [ClickAuthClient, ClickTransferClient, ClickPaymentClient, ClickPushClient],
  exports: [ClickAuthClient, ClickTransferClient, ClickPaymentClient, ClickPushClient],
})
export class ClickCoreModule {}
