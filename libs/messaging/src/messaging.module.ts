import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { IdempotencyService } from './idempotency.service';

export interface MessagingModuleOptions {
  serviceName: string;
}

@Module({})
export class MessagingModule {
  static forRoot(options: MessagingModuleOptions): DynamicModule {
    return {
      module: MessagingModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'MESSAGING_OPTIONS',
          useValue: options,
        },
        ProducerService,
        ConsumerService,
        IdempotencyService,
      ],
      exports: [ProducerService, ConsumerService, IdempotencyService],
      global: true,
    };
  }
}
