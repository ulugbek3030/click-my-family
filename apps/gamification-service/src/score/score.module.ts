import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserScoreEntity } from './entities/user-score.entity';
import { LevelDefinitionEntity } from './entities/level-definition.entity';
import { PointsHistoryEntity } from './entities/points-history.entity';
import { ScoreService } from './score.service';
import { LevelCalculatorService } from './level-calculator.service';
import { PremiumService } from './premium.service';
import { ScoreController } from './score.controller';
import { FamilyEventsConsumer } from './consumers/family-events.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([UserScoreEntity, LevelDefinitionEntity, PointsHistoryEntity])],
  providers: [ScoreService, LevelCalculatorService, PremiumService, FamilyEventsConsumer],
  controllers: [ScoreController],
})
export class ScoreModule {}
