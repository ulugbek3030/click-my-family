import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '@my-family/messaging';
import { InAppService } from '../in-app.service';
import { ClickPushClient } from '@my-family/click-core-client';
import { CARDS_EVENTS_EXCHANGE, CARDS_EVENTS, QUEUES } from '@my-family/common';

@Injectable()
export class CardEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(CardEventsConsumer.name);

  constructor(
    private readonly consumer: ConsumerService,
    private readonly inAppService: InAppService,
    private readonly pushClient: ClickPushClient,
  ) {}

  onModuleInit(): void {
    this.consumer.registerHandler(
      {
        queue: QUEUES.NOTIFICATION_CARDS_EVENTS,
        exchange: CARDS_EVENTS_EXCHANGE,
        routingKeys: [CARDS_EVENTS.CARD_SENT],
      },
      this.handleEvent.bind(this),
    );
  }

  private async handleEvent(message: any, routingKey: string): Promise<void> {
    const payload = message.payload || message;

    if (routingKey === CARDS_EVENTS.CARD_SENT) {
      await this.pushClient.sendPush({
        userId: payload.receiverUserId,
        title: 'Yangi tabrik kartochka!',
        body: 'Sizga tabrik kartochka keldi',
      });
      await this.inAppService.create(
        payload.receiverUserId,
        'Yangi tabrik kartochka!',
        'Sizga tabrik kartochka keldi',
        'card_received',
        { cardId: payload.cardId },
      );
    }
  }
}
