import { IsUUID, IsOptional, IsString, MaxLength } from 'class-validator';

export enum CardPriceType {
  FREE = 'free',
  PAID = 'paid',
  PREMIUM_FREE = 'premium_free',
}

export class SendCardDto {
  @IsUUID()
  templateId: string;

  @IsString()
  receiverUserId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  personalMessage?: string;
}

export class CardTemplateResponseDto {
  id: string;
  titleUz: string;
  titleRu: string;
  imageUrl: string;
  animationUrl?: string;
  priceType: CardPriceType;
  priceAmount: number;
  category?: string;
  isActive: boolean;
}

export class SentCardResponseDto {
  id: string;
  templateId: string;
  template?: CardTemplateResponseDto;
  senderUserId: string;
  receiverUserId: string;
  personalMessage?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}
