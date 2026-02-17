import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PersonEntity } from './entities/person.entity';
import { CreatePersonDto, UpdatePersonDto } from '@my-family/shared-dto';
import { ProducerService } from '@my-family/messaging';
import { CacheService } from '@my-family/caching';
import { CacheKey } from '@my-family/caching';
import { AuditService } from '@my-family/audit';
import { FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS } from '@my-family/common';
import { normalizePhone } from '@my-family/common';

@Injectable()
export class PersonService {
  private readonly logger = new Logger(PersonService.name);

  constructor(
    @InjectRepository(PersonEntity)
    private readonly personRepo: Repository<PersonEntity>,
    private readonly dataSource: DataSource,
    private readonly producer: ProducerService,
    private readonly cache: CacheService,
    private readonly audit: AuditService,
  ) {
    this.audit.setDataSource(this.dataSource, 'family_graph');
  }

  async create(dto: CreatePersonDto, ownerUserId: string): Promise<PersonEntity> {
    if (dto.phone) {
      dto.phone = normalizePhone(dto.phone);
    }

    const person = this.personRepo.create({
      ...dto,
      ownerUserId,
      birthDatePrecision: dto.birthDatePrecision || 'unknown',
      deathDatePrecision: dto.deathDatePrecision || 'unknown',
    });

    const saved = await this.personRepo.save(person);

    // Audit
    await this.audit.log({
      userId: ownerUserId,
      entityType: 'person',
      entityId: saved.id,
      action: 'CREATE',
      newData: saved as unknown as Record<string, unknown>,
    });

    // Publish event
    await this.producer.publish(FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS.PERSON_CREATED, {
      personId: saved.id,
      ownerUserId,
      firstName: saved.firstName,
      lastName: saved.lastName,
      phone: saved.phone,
      birthDate: saved.birthDate?.toISOString(),
      birthDatePrecision: saved.birthDatePrecision,
    });

    // Invalidate cache
    await this.cache.del(CacheKey.tree(ownerUserId));

    return saved;
  }

  async findById(id: string): Promise<PersonEntity> {
    const person = await this.personRepo.findOne({ where: { id } });
    if (!person) throw new NotFoundException('Person not found');
    return person;
  }

  async findByOwner(ownerUserId: string): Promise<PersonEntity[]> {
    return this.personRepo.find({
      where: { ownerUserId, isArchived: false },
      order: { createdAt: 'ASC' },
    });
  }

  async update(id: string, dto: UpdatePersonDto, userId: string): Promise<PersonEntity> {
    const person = await this.findById(id);
    if (person.ownerUserId !== userId) {
      throw new ForbiddenException('You can only update persons in your own tree');
    }

    const oldData = { ...person };

    if (dto.phone) {
      dto.phone = normalizePhone(dto.phone);
    }

    Object.assign(person, dto);
    const saved = await this.personRepo.save(person);

    await this.audit.log({
      userId,
      entityType: 'person',
      entityId: saved.id,
      action: 'UPDATE',
      oldData: oldData as unknown as Record<string, unknown>,
      newData: saved as unknown as Record<string, unknown>,
    });

    await this.producer.publish(FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS.PERSON_UPDATED, {
      personId: saved.id,
      ownerUserId: userId,
    });

    await this.cache.del(CacheKey.person(id));
    await this.cache.del(CacheKey.tree(userId));

    return saved;
  }

  async delete(id: string, userId: string): Promise<void> {
    const person = await this.findById(id);
    if (person.ownerUserId !== userId) {
      throw new ForbiddenException('You can only delete persons from your own tree');
    }

    person.isArchived = true;
    person.archivedAt = new Date();
    await this.personRepo.save(person);

    await this.audit.log({
      userId,
      entityType: 'person',
      entityId: person.id,
      action: 'ARCHIVE',
    });

    await this.producer.publish(FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS.PERSON_DELETED, {
      personId: person.id,
      ownerUserId: userId,
      wasConfirmed: person.isConfirmed,
    });

    await this.cache.del(CacheKey.person(id));
    await this.cache.del(CacheKey.tree(userId));
  }

  async restore(id: string, userId: string): Promise<PersonEntity> {
    const person = await this.findById(id);
    if (person.ownerUserId !== userId) {
      throw new ForbiddenException('You can only restore persons in your own tree');
    }
    if (!person.isArchived) {
      throw new BadRequestException('Person is not archived');
    }

    person.isArchived = false;
    person.archivedAt = null;
    const saved = await this.personRepo.save(person);

    await this.audit.log({
      userId,
      entityType: 'person',
      entityId: person.id,
      action: 'RESTORE',
    });

    await this.cache.del(CacheKey.tree(userId));
    return saved;
  }

  async confirm(personId: string, linkedUserId: string): Promise<PersonEntity> {
    const person = await this.findById(personId);

    if (person.ownerUserId === linkedUserId) {
      throw new BadRequestException('Cannot confirm yourself');
    }

    if (person.isConfirmed) {
      throw new ConflictException('Person is already confirmed');
    }

    // Verify phone matches
    if (person.phone) {
      const normalizedPersonPhone = normalizePhone(person.phone);
      const normalizedUserPhone = normalizePhone(linkedUserId);
      if (normalizedPersonPhone !== normalizedUserPhone) {
        throw new ForbiddenException('Phone number does not match');
      }
    }

    person.isConfirmed = true;
    person.confirmedAt = new Date();
    person.linkedUserId = linkedUserId;
    const saved = await this.personRepo.save(person);

    await this.audit.log({
      userId: linkedUserId,
      entityType: 'person',
      entityId: person.id,
      action: 'UPDATE',
      newData: { isConfirmed: true, linkedUserId } as unknown as Record<string, unknown>,
    });

    await this.producer.publish(FAMILY_EVENTS_EXCHANGE, FAMILY_EVENTS.PERSON_CONFIRMED, {
      personId: saved.id,
      ownerUserId: saved.ownerUserId,
      linkedUserId,
    });

    await this.cache.del(CacheKey.person(personId));
    await this.cache.del(CacheKey.tree(saved.ownerUserId));

    return saved;
  }

  async search(ownerUserId: string, query: string): Promise<PersonEntity[]> {
    return this.personRepo
      .createQueryBuilder('p')
      .where('p.owner_user_id = :ownerUserId', { ownerUserId })
      .andWhere('p.is_archived = false')
      .andWhere(
        '(LOWER(p.first_name) LIKE LOWER(:q) OR LOWER(p.last_name) LIKE LOWER(:q) OR p.phone LIKE :q)',
        { q: `%${query}%` },
      )
      .orderBy('p.first_name', 'ASC')
      .limit(50)
      .getMany();
  }

  async countByOwner(ownerUserId: string): Promise<number> {
    return this.personRepo.count({
      where: { ownerUserId, isArchived: false },
    });
  }
}
