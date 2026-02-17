import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '@my-family/messaging';
import { ScoreService } from '../score.service';
import {
  FAMILY_EVENTS_EXCHANGE,
  FAMILY_EVENTS,
  QUEUES,
  POINTS_PER_ADD,
  POINTS_PER_CONFIRM,
  POINTS_PER_DELETE,
  POINTS_PER_UNCONFIRM_DELETE,
} from '@my-family/common';

@Injectable()
export class FamilyEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(FamilyEventsConsumer.name);

  constructor(
    private readonly consumer: ConsumerService,
    private readonly scoreService: ScoreService,
  ) {}

  onModuleInit(): void {
    this.consumer.registerHandler(
      {
        queue: QUEUES.GAMIFICATION_FAMILY_EVENTS,
        exchange: FAMILY_EVENTS_EXCHANGE,
        routingKeys: [
          FAMILY_EVENTS.PERSON_CREATED,
          FAMILY_EVENTS.PERSON_CONFIRMED,
          FAMILY_EVENTS.PERSON_DELETED,
        ],
      },
      this.handleEvent.bind(this),
    );
  }

  private async handleEvent(message: any, routingKey: string): Promise<void> {
    const payload = message.payload || message;

    switch (routingKey) {
      case FAMILY_EVENTS.PERSON_CREATED:
        await this.scoreService.addPoints(payload.ownerUserId, POINTS_PER_ADD, 'person_add', payload.personId);
        break;
      case FAMILY_EVENTS.PERSON_CONFIRMED:
        await this.scoreService.addPoints(payload.ownerUserId, POINTS_PER_CONFIRM, 'person_confirm', payload.personId);
        break;
      case FAMILY_EVENTS.PERSON_DELETED:
        if (payload.wasConfirmed) {
          await this.scoreService.addPoints(payload.ownerUserId, POINTS_PER_UNCONFIRM_DELETE, 'person_delete_confirmed', payload.personId);
        } else {
          await this.scoreService.addPoints(payload.ownerUserId, POINTS_PER_DELETE, 'person_delete_unconfirmed', payload.personId);
        }
        break;
    }
  }
}
