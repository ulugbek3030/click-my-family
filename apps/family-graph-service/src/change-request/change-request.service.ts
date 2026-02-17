import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ChangeRequestEntity } from './entities/change-request.entity';
import { PersonService } from '../person/person.service';
import { ProducerService } from '@my-family/messaging';
import { AuditService } from '@my-family/audit';
import {
  FAMILY_EVENTS_EXCHANGE,
  FAMILY_EVENTS,
  CHANGE_REQUEST_EXPIRY_DAYS,
  MAX_PENDING_CHANGE_REQUESTS,
} from '@my-family/common';
import { addDays } from '@my-family/common';

@Injectable()
export class ChangeRequestService {
  private readonly logger = new Logger(ChangeRequestService.name);

  constructor(
    @InjectRepository(ChangeRequestEntity)
    private readonly repo: Repository<ChangeRequestEntity>,
    private readonly personService: PersonService,
    private readonly producer: ProducerService,
    private readonly audit: AuditService,
  ) {}

  async create(
    targetPersonId: string,
    treeOwnerUserId: string,
    requesterUserId: string,
    proposedChanges: Record<string, unknown>,
  ): Promise<ChangeRequestEntity> {
    // Verify requester is not the tree owner
    if (requesterUserId === treeOwnerUserId) {
      throw new BadRequestException('Cannot create change request for your own tree');
    }

    // Check max pending requests
    const pendingCount = await this.repo.count({
      where: { requesterUserId, status: 'pending' },
    });
    if (pendingCount >= MAX_PENDING_CHANGE_REQUESTS) {
      throw new BadRequestException(
        `Maximum ${MAX_PENDING_CHANGE_REQUESTS} pending change requests allowed`,
      );
    }

    const cr = this.repo.create({
      targetPersonId,
      treeOwnerUserId,
      requesterUserId,
      proposedChanges,
      status: 'pending',
      expiresAt: addDays(new Date(), CHANGE_REQUEST_EXPIRY_DAYS),
    });

    const saved = await this.repo.save(cr);

    await this.audit.log({
      userId: requesterUserId,
      entityType: 'change_request',
      entityId: saved.id,
      action: 'CREATE',
      newData: saved as unknown as Record<string, unknown>,
    });

    await this.producer.publish(FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS.CHANGE_REQUEST_CREATED, {
      changeRequestId: saved.id,
      targetPersonId,
      requesterUserId,
      treeOwnerUserId,
      proposedChanges,
    });

    return saved;
  }

  async findByTreeOwner(treeOwnerUserId: string): Promise<ChangeRequestEntity[]> {
    return this.repo.find({
      where: { treeOwnerUserId },
      relations: ['targetPerson'],
      order: { createdAt: 'DESC' },
    });
  }

  async approve(id: string, userId: string): Promise<ChangeRequestEntity> {
    const cr = await this.repo.findOne({ where: { id }, relations: ['targetPerson'] });
    if (!cr) throw new NotFoundException('Change request not found');
    if (cr.treeOwnerUserId !== userId) throw new ForbiddenException('Not your tree');
    if (cr.status !== 'pending') throw new BadRequestException('Change request is not pending');

    // Apply changes to the person
    const person = await this.personService.findById(cr.targetPersonId);
    await this.personService.update(cr.targetPersonId, cr.proposedChanges as any, userId);

    cr.status = 'approved';
    cr.reviewedAt = new Date();
    const saved = await this.repo.save(cr);

    await this.producer.publish(FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS.CHANGE_REQUEST_APPROVED, {
      changeRequestId: saved.id,
      requesterUserId: cr.requesterUserId,
    });

    return saved;
  }

  async reject(id: string, userId: string): Promise<ChangeRequestEntity> {
    const cr = await this.repo.findOne({ where: { id } });
    if (!cr) throw new NotFoundException('Change request not found');
    if (cr.treeOwnerUserId !== userId) throw new ForbiddenException('Not your tree');
    if (cr.status !== 'pending') throw new BadRequestException('Change request is not pending');

    cr.status = 'rejected';
    cr.reviewedAt = new Date();
    const saved = await this.repo.save(cr);

    await this.producer.publish(FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS.CHANGE_REQUEST_REJECTED, {
      changeRequestId: saved.id,
      requesterUserId: cr.requesterUserId,
    });

    return saved;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async expirePendingRequests(): Promise<void> {
    const result = await this.repo.update(
      { status: 'pending', expiresAt: LessThan(new Date()) },
      { status: 'expired' },
    );
    if (result.affected && result.affected > 0) {
      this.logger.log(`Expired ${result.affected} change requests`);
    }
  }
}
