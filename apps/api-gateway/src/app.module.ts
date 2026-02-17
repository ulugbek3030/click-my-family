import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ThrottlerModule } from '@nestjs/throttler';
import { CachingModule } from '@my-family/caching';
import { ClickCoreModule } from '@my-family/click-core-client';
import { AuthModule } from './auth/auth.module';
import { FamilyGraphController } from './proxy/family-graph.controller';
import { PrivacyController } from './proxy/privacy.controller';
import { GamificationController } from './proxy/gamification.controller';
import { TransferController } from './proxy/transfer.controller';
import { NotificationController } from './proxy/notification.controller';
import { CardsController } from './proxy/cards.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    ClientsModule.registerAsync([
      {
        name: 'FAMILY_GRAPH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('FAMILY_GRAPH_HOST', 'localhost'),
            port: config.get<number>('FAMILY_GRAPH_GRPC_PORT', 50051),
          },
        }),
      },
      {
        name: 'PRIVACY_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('PRIVACY_HOST', 'localhost'),
            port: config.get<number>('PRIVACY_GRPC_PORT', 50052),
          },
        }),
      },
      {
        name: 'GAMIFICATION_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('GAMIFICATION_HOST', 'localhost'),
            port: config.get<number>('GAMIFICATION_GRPC_PORT', 50053),
          },
        }),
      },
      {
        name: 'TRANSFER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('TRANSFER_HOST', 'localhost'),
            port: config.get<number>('TRANSFER_GRPC_PORT', 50054),
          },
        }),
      },
      {
        name: 'NOTIFICATION_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('NOTIFICATION_HOST', 'localhost'),
            port: config.get<number>('NOTIFICATION_GRPC_PORT', 50055),
          },
        }),
      },
      {
        name: 'CARDS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('CARDS_HOST', 'localhost'),
            port: config.get<number>('CARDS_GRPC_PORT', 50056),
          },
        }),
      },
    ]),
    CachingModule,
    ClickCoreModule,
    AuthModule,
  ],
  controllers: [
    FamilyGraphController,
    PrivacyController,
    GamificationController,
    TransferController,
    NotificationController,
    CardsController,
  ],
})
export class AppModule {}
