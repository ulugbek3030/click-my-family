import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SentCardEntity } from './entities/sent-card.entity';
import { TemplateService } from './template.service';
import { ClickPaymentClient } from '@my-family/click-core-client';
import { ProducerService } from '@my-family/messaging';
import { CARDS_EVENTS_EXCHANGE, CARDS_EVENTS } from '@my-family/common';

@Injectable()
export class SendingService {
  private readonly logger = new Logger(SendingService.name);

  constructor(
    @InjectRepository(SentCardEntity)
    private readonly sentCardRepo: Repository<SentCardEntity>,
    private readonly templateService: TemplateService,
    private readonly clickPayment: ClickPaymentClient,
    private readonly producer: ProducerService,
  ) {}

  async sendCard(
    senderUserId: string,
    receiverUserId: string,
    receiverPersonId: string,
    templateId: string,
    personalMessage?: string,
  ): Promise<SentCardEntity> {
    const template = await this.templateService.getTemplateById(templateId);
    if (!template) {
      throw new NotFoundException('Card template not found');
    }

    let clickPaymentId: string | null = null;
    const isPaid = !template.isFree && template.priceTiyin > 0;

    if (isPaid) {
      try {
        const payment = await this.clickPayment.processPayment({
          userId: senderUserId,
          amount: template.priceTiyin,
          description: `Card: ${template.name}`,
          referenceType: 'card_purchase',
        });
        clickPaymentId = payment.paymentId;
      } catch (error) {
        throw new BadRequestException('Payment failed. Please try again.');
      }
    }

    const sentCard = this.sentCardRepo.create({
      senderUserId,
      receiverUserId,
      receiverPersonId,
      templateId,
      personalMessage: personalMessage || null,
      isPaid,
      paymentAmountTiyin: isPaid ? template.priceTiyin : 0,
      clickPaymentId,
    });

    const saved = await this.sentCardRepo.save(sentCard);

    await this.producer.publish(CARDS_EVENTS_EXCHANGE, CARDS_EVENTS.CARD_SENT, {
      cardId: saved.id,
      senderUserId,
      receiverUserId,
      templateName: template.name,
    });

    this.logger.log(`Card sent: ${saved.id} from ${senderUserId} to ${receiverUserId}`);
    return saved;
  }

  async markAsRead(cardId: string, userId: string): Promise<void> {
    const card = await this.sentCardRepo.findOne({
      where: { id: cardId, receiverUserId: userId },
    });

    if (!card) throw new NotFoundException('Card not found');
    if (card.isRead) return;

    card.isRead = true;
    card.readAt = new Date();
    await this.sentCardRepo.save(card);

    await this.producer.publish(CARDS_EVENTS_EXCHANGE, CARDS_EVENTS.CARD_READ, {
      cardId,
      senderUserId: card.senderUserId,
      receiverUserId: userId,
    });
  }

  async getReceivedCards(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: SentCardEntity[]; total: number }> {
    const [items, total] = await this.sentCardRepo.findAndCount({
      where: { receiverUserId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total };
  }

  async getSentCards(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: SentCardEntity[]; total: number }> {
    const [items, total] = await this.sentCardRepo.findAndCount({
      where: { senderUserId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total };
  }
}
