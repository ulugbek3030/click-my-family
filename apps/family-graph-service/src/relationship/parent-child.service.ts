import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParentChildEntity } from './entities/parent-child.entity';
import { CreateParentChildDto } from '@my-family/shared-dto';
import { ProducerService } from '@my-family/messaging';
import { CacheService, CacheKey } from '@my-family/caching';
import { AuditService } from '@my-family/audit';
import { FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS } from '@my-family/common';

@Injectable()
export class ParentChildService {
  private readonly logger = new Logger(ParentChildService.name);

  constructor(
    @InjectRepository(ParentChildEntity)
    private readonly repo: Repository<ParentChildEntity>,
    private readonly producer: ProducerService,
    private readonly cache: CacheService,
    private readonly audit: AuditService,
  ) {}

  async create(dto: CreateParentChildDto, ownerUserId: string): Promise<ParentChildEntity> {
    const link = this.repo.create({
      ...dto,
      ownerUserId,
    });

    const saved = await this.repo.save(link);

    await this.audit.log({
      userId: ownerUserId,
      entityType: 'parent_child',
      entityId: saved.id,
      action: 'CREATE',
      newData: saved as unknown as Record<string, unknown>,
    });

    await this.producer.publish(FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS.RELATIONSHIP_CREATED, {
      relationshipId: saved.id,
      ownerUserId,
      type: 'parent_child',
      parentId: saved.parentId,
      childId: saved.childId,
    });

    await this.cache.del(CacheKey.tree(ownerUserId));
    return saved;
  }

  async findByOwner(ownerUserId: string): Promise<ParentChildEntity[]> {
    return this.repo.find({
      where: { ownerUserId },
      relations: ['parent', 'child'],
      order: { createdAt: 'ASC' },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const link = await this.repo.findOne({ where: { id } });
    if (!link) throw new NotFoundException('Parent-child link not found');
    if (link.ownerUserId !== userId) throw new ForbiddenException('Not your tree');

    await this.repo.remove(link);

    await this.producer.publish(FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS.RELATIONSHIP_DELETED, {
      relationshipId: id,
      ownerUserId: userId,
      type: 'parent_child',
    });

    await this.cache.del(CacheKey.tree(userId));
  }
}
