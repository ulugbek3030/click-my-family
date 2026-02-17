import { Injectable, Logger, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqplib from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent } from '@my-family/shared-interfaces';
import {
  FAMILY_EVENTS_EXCHANGE,
  GAMIFICATION_EVENTS_EXCHANGE,
  CARDS_EVENTS_EXCHANGE,
  ADMIN_EVENTS_EXCHANGE,
  DEAD_LETTER_EXCHANGE,
} from '@my-family/common';

@Injectable()
export class ProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProducerService.name);
  private connection: any = null;
  private channel: amqplib.Channel | null = null;

  constructor(
    private readonly config: ConfigService,
    @Inject('MESSAGING_OPTIONS') private readonly options: { serviceName: string },
  ) {}

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      const url = this.config.get('RABBITMQ_URL', 'amqp://my_family_user:my_family_pass@localhost:5672');
      this.connection = await amqplib.connect(url);
      const channel = await this.connection.createChannel();
      this.channel = channel;

      // Declare exchanges
      await channel.assertExchange(FAMILY_EVENTS_EXCHANGE, 'topic', { durable: true });
      await channel.assertExchange(GAMIFICATION_EVENTS_EXCHANGE, 'topic', { durable: true });
      await channel.assertExchange(CARDS_EVENTS_EXCHANGE, 'topic', { durable: true });
      await channel.assertExchange(ADMIN_EVENTS_EXCHANGE, 'topic', { durable: true });
      await channel.assertExchange(DEAD_LETTER_EXCHANGE, 'topic', { durable: true });

      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private async disconnect(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      this.logger.error('Error disconnecting from RabbitMQ', error);
    }
  }

  async publish<T>(exchange: string, routingKey: string, payload: T): Promise<void> {
    if (!this.channel) {
      this.logger.error('RabbitMQ channel not available');
      throw new Error('RabbitMQ channel not available');
    }

    const event: DomainEvent<T> = {
      eventId: uuidv4(),
      eventType: routingKey,
      timestamp: new Date().toISOString(),
      sourceService: this.options.serviceName,
      payload,
    };

    const message = Buffer.from(JSON.stringify(event));

    this.channel.publish(exchange, routingKey, message, {
      persistent: true,
      contentType: 'application/json',
      messageId: event.eventId,
      timestamp: Date.now(),
      headers: {
        sourceService: this.options.serviceName,
      },
    });

    this.logger.debug(`Published event ${routingKey} to ${exchange}`);
  }
}
