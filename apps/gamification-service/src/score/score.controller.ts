import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ScoreService } from './score.service';
import { LevelCalculatorService } from './level-calculator.service';
import { PremiumService } from './premium.service';

@Controller()
export class ScoreController {
  constructor(
    private readonly scoreService: ScoreService,
    private readonly levelCalc: LevelCalculatorService,
    private readonly premiumService: PremiumService,
  ) {}

  @MessagePattern({ cmd: 'gamification.score' })
  async getScore(data: { userId: string }) {
    return this.scoreService.getOrCreate(data.userId);
  }

  @MessagePattern({ cmd: 'gamification.levels' })
  async getLevels() {
    return this.levelCalc.getAllLevels();
  }

  @MessagePattern({ cmd: 'gamification.history' })
  async getHistory(data: { userId: string; limit?: number; offset?: number }) {
    return this.scoreService.getHistory(data.userId, data.limit, data.offset);
  }

  @MessagePattern({ cmd: 'gamification.upgradePremium' })
  async upgradePremium(data: { userId: string }) {
    return this.premiumService.upgradeToPremium(data.userId);
  }
}
