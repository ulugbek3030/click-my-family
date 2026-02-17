import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardTemplateEntity } from './entities/card-template.entity';
import { SentCardEntity } from './entities/sent-card.entity';
import { TemplateService } from './template.service';
import { SendingService } from './sending.service';
import { CardsController } from './cards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CardTemplateEntity, SentCardEntity])],
  providers: [TemplateService, SendingService],
  controllers: [CardsController],
})
export class CardsModule {}
