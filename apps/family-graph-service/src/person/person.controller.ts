import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PersonService } from './person.service';
import { CreatePersonDto, UpdatePersonDto } from '@my-family/shared-dto';

@Controller()
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @MessagePattern({ cmd: 'person.create' })
  async create(@Payload() data: { dto: CreatePersonDto; userId: string }) {
    return this.personService.create(data.dto, data.userId);
  }

  @MessagePattern({ cmd: 'person.findById' })
  async findById(@Payload() data: { id: string }) {
    return this.personService.findById(data.id);
  }

  @MessagePattern({ cmd: 'person.findByOwner' })
  async findByOwner(@Payload() data: { ownerUserId: string }) {
    return this.personService.findByOwner(data.ownerUserId);
  }

  @MessagePattern({ cmd: 'person.update' })
  async update(@Payload() data: { id: string; dto: UpdatePersonDto; userId: string }) {
    return this.personService.update(data.id, data.dto, data.userId);
  }

  @MessagePattern({ cmd: 'person.delete' })
  async delete(@Payload() data: { id: string; userId: string }) {
    return this.personService.delete(data.id, data.userId);
  }

  @MessagePattern({ cmd: 'person.restore' })
  async restore(@Payload() data: { id: string; userId: string }) {
    return this.personService.restore(data.id, data.userId);
  }

  @MessagePattern({ cmd: 'person.confirm' })
  async confirm(@Payload() data: { personId: string; linkedUserId: string }) {
    return this.personService.confirm(data.personId, data.linkedUserId);
  }

  @MessagePattern({ cmd: 'person.search' })
  async search(@Payload() data: { ownerUserId: string; query: string }) {
    return this.personService.search(data.ownerUserId, data.query);
  }

  @MessagePattern({ cmd: 'person.count' })
  async count(@Payload() data: { ownerUserId: string }) {
    return this.personService.countByOwner(data.ownerUserId);
  }
}
