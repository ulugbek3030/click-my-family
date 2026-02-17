import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@my-family/database';
import { MessagingModule } from '@my-family/messaging';
import { CachingModule } from '@my-family/caching';
import { ClickCoreModule } from '@my-family/click-core-client';
import { CardsModule } from './cards/cards.module';
import { CardTemplateEntity } from './cards/entities/card-template.entity';
import { SentCardEntity } from './cards/entities/sent-card.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot('cards', [CardTemplateEntity, SentCardEntity]),
    MessagingModule.forRoot({ serviceName: 'cards-service' }),
    CachingModule,
    ClickCoreModule,
    CardsModule,
  ],
})
export class AppModule {}
