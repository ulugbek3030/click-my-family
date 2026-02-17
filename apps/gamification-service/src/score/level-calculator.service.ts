import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LevelDefinitionEntity } from './entities/level-definition.entity';
import { CacheService, CacheKey } from '@my-family/caching';

@Injectable()
export class LevelCalculatorService {
  private readonly logger = new Logger(LevelCalculatorService.name);

  constructor(
    @InjectRepository(LevelDefinitionEntity)
    private readonly levelRepo: Repository<LevelDefinitionEntity>,
    private readonly cache: CacheService,
  ) {}

  async calculateLevel(totalPoints: number): Promise<number> {
    const levels = await this.getAllLevels();
    let currentLevel = 1;
    for (const level of levels) {
      if (totalPoints >= level.minPoints) {
        currentLevel = level.level;
      }
    }
    return currentLevel;
  }

  async getAllLevels(): Promise<LevelDefinitionEntity[]> {
    const cached = await this.cache.get<LevelDefinitionEntity[]>(CacheKey.levels());
    if (cached) return cached;

    const levels = await this.levelRepo.find({ order: { level: 'ASC' } });
    await this.cache.set(CacheKey.levels(), levels, 3600);
    return levels;
  }
}
