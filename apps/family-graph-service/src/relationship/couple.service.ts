import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CoupleRelationshipEntity } from './entities/couple-relationship.entity';
import { CreateCoupleRelationshipDto } from '@my-family/shared-dto';
import { ProducerService } from '@my-family/messaging';
import { CacheService, CacheKey } from '@my-family/caching';
import { AuditService } from '@my-family/audit';
import { FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS } from '@my-family/common';

@Injectable()
export class CoupleService {
  private readonly logger = new Logger(CoupleService.name);

  constructor(
    @InjectRepository(CoupleRelationshipEntity)
    private readonly repo: Repository<CoupleRelationshipEntity>,
    private readonly dataSource: DataSource,
    private readonly producer: ProducerService,
    private readonly cache: CacheService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreateCoupleRelationshipDto, ownerUserId: string): Promise<CoupleRelationshipEntity> {
    const relationship = this.repo.create({
      ...dto,
      ownerUserId,
      personAId: dto.personAId,
      personBId: dto.personBId,
      startDatePrecision: dto.startDatePrecision || 'unknown',
      endDatePrecision: dto.endDatePrecision || 'unknown',
    });

    const saved = await this.repo.save(relationship);

    await this.audit.log({
      userId: ownerUserId,
      entityType: 'couple_relationship',
      entityId: saved.id,
      action: 'CREATE',
      newData: saved as unknown as Record<string, unknown>,
    });

    await this.producer.publish(FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS.RELATIONSHIP_CREATED, {
      relationshipId: saved.id,
      ownerUserId,
      type: 'couple',
      personAId: saved.personAId,
      personBId: saved.personBId,
    });

    await this.cache.del(CacheKey.tree(ownerUserId));
    return saved;
  }

  async findByOwner(ownerUserId: string): Promise<CoupleRelationshipEntity[]> {
    return this.repo.find({
      where: { ownerUserId },
      relations: ['personA', 'personB'],
      order: { createdAt: 'ASC' },
    });
  }

  async update(
    id: string,
    dto: Partial<CreateCoupleRelationshipDto>,
    userId: string,
  ): Promise<CoupleRelationshipEntity> {
    const rel = await this.repo.findOne({ where: { id } });
    if (!rel) throw new NotFoundException('Relationship not found');
    if (rel.ownerUserId !== userId) throw new ForbiddenException('Not your tree');

    Object.assign(rel, dto);
    const saved = await this.repo.save(rel);

    await this.cache.del(CacheKey.tree(userId));
    return saved;
  }

  async delete(id: string, userId: string): Promise<void> {
    const rel = await this.repo.findOne({ where: { id } });
    if (!rel) throw new NotFoundException('Relationship not found');
    if (rel.ownerUserId !== userId) throw new ForbiddenException('Not your tree');

    await this.repo.remove(rel);

    await this.producer.publish(FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS.RELATIONSHIP_DELETED, {
      relationshipId: id,
      ownerUserId: userId,
      type: 'couple',
    });

    await this.cache.del(CacheKey.tree(userId));
  }
}
