import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserScoreEntity } from './entities/user-score.entity';
import { MAX_PREMIUM_RELATIVES } from '@my-family/common';
import { CacheService, CacheKey } from '@my-family/caching';

@Injectable()
export class PremiumService {
  private readonly logger = new Logger(PremiumService.name);

  constructor(
    @InjectRepository(UserScoreEntity)
    private readonly scoreRepo: Repository<UserScoreEntity>,
    private readonly cache: CacheService,
  ) {}

  async upgradeToPremium(userId: string): Promise<UserScoreEntity> {
    const score = await this.scoreRepo.findOne({ where: { userId } });
    if (!score) throw new BadRequestException('User score not found');
    if (score.isPremium) throw new BadRequestException('Already premium');

    score.isPremium = true;
    score.maxRelatives = MAX_PREMIUM_RELATIVES;
    const saved = await this.scoreRepo.save(score);

    await this.cache.del(CacheKey.score(userId));
    return saved;
  }
}
