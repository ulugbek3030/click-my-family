import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TemplateService } from './template.service';
import { SendingService } from './sending.service';

@Controller()
export class CardsController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly sendingService: SendingService,
  ) {}

  @MessagePattern({ cmd: 'cards.getTemplates' })
  async getTemplates(@Payload() data: { category?: string }) {
    return this.templateService.getTemplates(data.category);
  }

  @MessagePattern({ cmd: 'cards.getCategories' })
  async getCategories() {
    return this.templateService.getCategories();
  }

  @MessagePattern({ cmd: 'cards.send' })
  async sendCard(
    @Payload()
    data: {
      senderUserId: string;
      receiverUserId: string;
      receiverPersonId: string;
      templateId: string;
      personalMessage?: string;
    },
  ) {
    return this.sendingService.sendCard(
      data.senderUserId,
      data.receiverUserId,
      data.receiverPersonId,
      data.templateId,
      data.personalMessage,
    );
  }

  @MessagePattern({ cmd: 'cards.markRead' })
  async markAsRead(@Payload() data: { cardId: string; userId: string }) {
    return this.sendingService.markAsRead(data.cardId, data.userId);
  }

  @MessagePattern({ cmd: 'cards.received' })
  async getReceivedCards(
    @Payload() data: { userId: string; page?: number; limit?: number },
  ) {
    return this.sendingService.getReceivedCards(data.userId, data.page, data.limit);
  }

  @MessagePattern({ cmd: 'cards.sent' })
  async getSentCards(
    @Payload() data: { userId: string; page?: number; limit?: number },
  ) {
    return this.sendingService.getSentCards(data.userId, data.page, data.limit);
  }
}
