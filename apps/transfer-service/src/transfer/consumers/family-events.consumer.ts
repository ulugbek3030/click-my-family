import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '@my-family/messaging';
import { SelectionService } from '../selection.service';
import {
  FAMILY_EVENTS_EXCHANGE,
  FAMILY_EVENTS,
  QUEUES,
} from '@my-family/common';

@Injectable()
export class FamilyEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(FamilyEventsConsumer.name);

  constructor(
    private readonly consumer: ConsumerService,
    private readonly selectionService: SelectionService,
  ) {}

  onModuleInit(): void {
    this.consumer.registerHandler(
      {
        queue: QUEUES.TRANSFER_FAMILY_EVENTS,
        exchange: FAMILY_EVENTS_EXCHANGE,
        routingKeys: [FAMILY_EVENTS.PERSON_DELETED],
      },
      this.handleEvent.bind(this),
    );
  }

  private async handleEvent(message: any, routingKey: string): Promise<void> {
    const payload = message.payload || message;

    if (routingKey === FAMILY_EVENTS.PERSON_DELETED) {
      await this.selectionService.deactivateByPersonId(
        payload.personId,
        'person_deleted',
      );
      this.logger.log(`Deactivated selections for deleted person ${payload.personId}`);
    }
  }
}
