import { Injectable, Logger, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqplib from 'amqplib';
import { DEAD_LETTER_EXCHANGE } from '@my-family/common';
import { IdempotencyService } from './idempotency.service';

export interface ConsumerOptions {
  queue: string;
  exchange: string;
  routingKeys: string[];
  prefetch?: number;
  maxRetries?: number;
}

export type MessageHandler = (message: unknown, routingKey: string) => Promise<void>;

@Injectable()
export class ConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ConsumerService.name);
  private connection: any = null;
  private channel: amqplib.Channel | null = null;
  private readonly handlers: Map<string, { options: ConsumerOptions; handler: MessageHandler }> = new Map();

  constructor(
    private readonly config: ConfigService,
    private readonly idempotencyService: IdempotencyService,
    @Inject('MESSAGING_OPTIONS') private readonly moduleOptions: { serviceName: string },
  ) {}

  async onModuleInit(): Promise<void> {
    await this.connect();
    for (const [, { options, handler }] of this.handlers) {
      await this.setupConsumer(options, handler);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      const url = this.config.get('RABBITMQ_URL', 'amqp://my_family_user:my_family_pass@localhost:5672');
      this.connection = await amqplib.connect(url);
      this.channel = await this.connection.createChannel();
      this.logger.log('Consumer connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to connect consumer to RabbitMQ', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private async disconnect(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      this.logger.error('Error disconnecting consumer from RabbitMQ', error);
    }
  }

  registerHandler(options: ConsumerOptions, handler: MessageHandler): void {
    this.handlers.set(options.queue, { options, handler });
  }

  private async setupConsumer(options: ConsumerOptions, handler: MessageHandler): Promise<void> {
    if (!this.channel) return;

    const { queue, exchange, routingKeys, prefetch = 10, maxRetries = 3 } = options;

    await this.channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': DEAD_LETTER_EXCHANGE,
        'x-dead-letter-routing-key': `${queue}.dead`,
      },
    });

    for (const key of routingKeys) {
      await this.channel.bindQueue(queue, exchange, key);
    }

    await this.channel.prefetch(prefetch);

    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        const eventId = content.eventId || msg.properties.messageId;

        // Idempotency check
        if (eventId && await this.idempotencyService.isProcessed(eventId)) {
          this.logger.debug(`Event ${eventId} already processed, skipping`);
          this.channel!.ack(msg);
          return;
        }

        await handler(content, msg.fields.routingKey);

        if (eventId) {
          await this.idempotencyService.markProcessed(eventId);
        }

        this.channel!.ack(msg);
      } catch (error) {
        const retryCount = (msg.properties.headers?.['x-retry-count'] || 0) as number;

        if (retryCount >= maxRetries) {
          this.logger.error(`Message failed after ${maxRetries} retries, sending to DLQ`, error);
          this.channel!.nack(msg, false, false);
        } else {
          this.logger.warn(`Message processing failed (attempt ${retryCount + 1}), requeuing`, error);
          this.channel!.nack(msg, false, true);
        }
      }
    });

    this.logger.log(`Consumer registered for queue: ${queue}`);
  }
}
