import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '@my-family/messaging';
import { SelectionService } from '../selection.service';
import {
  GAMIFICATION_EVENTS_EXCHANGE,
  GAMIFICATION_EVENTS,
  QUEUES,
} from '@my-family/common';

@Injectable()
export class GamificationEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(GamificationEventsConsumer.name);

  constructor(
    private readonly consumer: ConsumerService,
    private readonly selectionService: SelectionService,
  ) {}

  onModuleInit(): void {
    this.consumer.registerHandler(
      {
        queue: QUEUES.TRANSFER_GAMIFICATION_EVENTS,
        exchange: GAMIFICATION_EVENTS_EXCHANGE,
        routingKeys: [GAMIFICATION_EVENTS.LEVEL_CHANGED],
      },
      this.handleEvent.bind(this),
    );
  }

  private async handleEvent(message: any, routingKey: string): Promise<void> {
    const payload = message.payload || message;

    if (routingKey === GAMIFICATION_EVENTS.LEVEL_CHANGED) {
      if (payload.newLevel < 3 && payload.previousLevel >= 3) {
        await this.selectionService.deactivateSelection(
          payload.userId,
          'level_dropped_below_3',
        );
        this.logger.warn(
          `Deactivated transfer selection for user ${payload.userId}: level dropped from ${payload.previousLevel} to ${payload.newLevel}`,
        );
      }
    }
  }
}
