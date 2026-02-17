import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '@my-family/messaging';
import { InAppService } from '../in-app.service';
import { FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS, QUEUES } from '@my-family/common';

@Injectable()
export class FamilyEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(FamilyEventsConsumer.name);

  constructor(
    private readonly consumer: ConsumerService,
    private readonly inAppService: InAppService,
  ) {}

  onModuleInit(): void {
    this.consumer.registerHandler(
      {
        queue: QUEUES.NOTIFICATION_FAMILY_EVENTS,
        exchange: FAMILY_EVENTS_EXCHANGE,
        routingKeys: [FAMILY_EVENTS.CHANGE_REQUEST_CREATED, FAMILY_EVENTS.PERSON_CONFIRMED],
      },
      this.handleEvent.bind(this),
    );
  }

  private async handleEvent(message: any, routingKey: string): Promise<void> {
    const payload = message.payload || message;

    switch (routingKey) {
      case FAMILY_EVENTS.CHANGE_REQUEST_CREATED:
        await this.inAppService.create(
          payload.treeOwnerUserId,
          "O'zgartirish so'rovi",
          "Sizning shajara daraxtingizga o'zgartirish so'rovi keldi",
          'change_request',
          { changeRequestId: payload.changeRequestId },
        );
        break;
      case FAMILY_EVENTS.PERSON_CONFIRMED:
        await this.inAppService.create(
          payload.ownerUserId,
          'Qarindosh tasdiqlandi',
          'Qarindoshingiz shaxsini tasdiqladi',
          'person_confirmed',
          { personId: payload.personId },
        );
        break;
    }
  }
}
