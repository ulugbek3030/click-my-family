import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@my-family/database';
import { MessagingModule } from '@my-family/messaging';
import { CachingModule } from '@my-family/caching';
import { ScoreModule } from './score/score.module';
import { UserScoreEntity } from './score/entities/user-score.entity';
import { LevelDefinitionEntity } from './score/entities/level-definition.entity';
import { PointsHistoryEntity } from './score/entities/points-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot('gamification', [UserScoreEntity, LevelDefinitionEntity, PointsHistoryEntity]),
    MessagingModule.forRoot({ serviceName: 'gamification-service' }),
    CachingModule,
    ScoreModule,
  ],
})
export class AppModule {}
