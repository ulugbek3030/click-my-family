import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserScoreEntity } from './entities/user-score.entity';
import { PointsHistoryEntity } from './entities/points-history.entity';
import { LevelCalculatorService } from './level-calculator.service';
import { ProducerService } from '@my-family/messaging';
import { CacheService, CacheKey } from '@my-family/caching';
import { GAMIFICATION_EVENTS_EXCHANGE, GAMIFICATION_EVENTS } from '@my-family/common';

@Injectable()
export class ScoreService {
  private readonly logger = new Logger(ScoreService.name);

  constructor(
    @InjectRepository(UserScoreEntity)
    private readonly scoreRepo: Repository<UserScoreEntity>,
    @InjectRepository(PointsHistoryEntity)
    private readonly historyRepo: Repository<PointsHistoryEntity>,
    private readonly levelCalc: LevelCalculatorService,
    private readonly producer: ProducerService,
    private readonly cache: CacheService,
  ) {}

  async getOrCreate(userId: string): Promise<UserScoreEntity> {
    let score = await this.scoreRepo.findOne({ where: { userId } });
    if (!score) {
      score = this.scoreRepo.create({ userId });
      score = await this.scoreRepo.save(score);
    }
    return score;
  }

  async addPoints(userId: string, delta: number, reason: string, referenceId?: string): Promise<UserScoreEntity> {
    const score = await this.getOrCreate(userId);
    const oldLevel = score.currentLevel;

    score.totalPoints = Math.max(0, score.totalPoints + delta);
    if (delta > 0 && reason.includes('add')) score.relativesAdded += 1;
    if (delta > 0 && reason.includes('confirm')) score.relativesConfirmed += 1;
    if (delta < 0 && reason.includes('delete_unconfirmed')) score.relativesAdded = Math.max(0, score.relativesAdded - 1);
    if (delta < 0 && reason.includes('delete_confirmed')) {
      score.relativesAdded = Math.max(0, score.relativesAdded - 1);
      score.relativesConfirmed = Math.max(0, score.relativesConfirmed - 1);
    }

    score.currentLevel = await this.levelCalc.calculateLevel(score.totalPoints);
    await this.scoreRepo.save(score);

    await this.historyRepo.save(this.historyRepo.create({
      userId,
      pointsDelta: delta,
      reason,
      referenceId: referenceId || null,
    }));

    if (score.currentLevel !== oldLevel) {
      await this.producer.publish(GAMIFICATION_EVENTS_EXCHANGE, GAMIFICATION_EVENTS.LEVEL_CHANGED, {
        userId,
        oldLevel,
        newLevel: score.currentLevel,
        totalPoints: score.totalPoints,
      });
    }

    await this.cache.del(CacheKey.score(userId));
    return score;
  }

  async getHistory(userId: string, limit = 20, offset = 0): Promise<PointsHistoryEntity[]> {
    return this.historyRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }
}
