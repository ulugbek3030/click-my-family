import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardTemplateEntity } from './entities/card-template.entity';
import { CacheService, CacheKey } from '@my-family/caching';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(
    @InjectRepository(CardTemplateEntity)
    private readonly templateRepo: Repository<CardTemplateEntity>,
    private readonly cache: CacheService,
  ) {}

  async getTemplates(category?: string): Promise<CardTemplateEntity[]> {
    const cacheKey = category
      ? CacheKey.cardTemplates() + `:${category}`
      : CacheKey.cardTemplates();

    const cached = await this.cache.get<CardTemplateEntity[]>(cacheKey);
    if (cached) return cached;

    const where: any = { isActive: true };
    if (category) where.category = category;

    const templates = await this.templateRepo.find({
      where,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });

    await this.cache.set(cacheKey, templates, 3600);
    return templates;
  }

  async getTemplateById(id: string): Promise<CardTemplateEntity | null> {
    return this.templateRepo.findOne({ where: { id, isActive: true } });
  }

  async getCategories(): Promise<string[]> {
    const cacheKey = 'cards:categories';
    const cached = await this.cache.get<string[]>(cacheKey);
    if (cached) return cached;

    const result = await this.templateRepo
      .createQueryBuilder('t')
      .select('DISTINCT t.category', 'category')
      .where('t.is_active = true')
      .getRawMany();

    const categories = result.map((r: any) => r.category);
    await this.cache.set(cacheKey, categories, 3600);
    return categories;
  }
}
