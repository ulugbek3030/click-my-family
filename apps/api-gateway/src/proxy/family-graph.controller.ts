import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Inject, Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePersonDto, UpdatePersonDto, CreateCoupleRelationshipDto, CreateParentChildDto } from '@my-family/shared-dto';

@ApiTags('Family Graph')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class FamilyGraphController {
  constructor(
    @Inject('FAMILY_GRAPH_SERVICE') private readonly familyClient: ClientProxy,
    @Inject('PRIVACY_SERVICE') private readonly privacyClient: ClientProxy,
  ) {}

  // --- Persons ---
  @Post('persons')
  async createPerson(@Body() dto: CreatePersonDto, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'person.create' }, { dto, userId: req.user.userId }),
    );
  }

  @Get('persons')
  async listPersons(@Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'person.findByOwner' }, { ownerUserId: req.user.userId }),
    );
  }

  @Get('persons/search')
  async searchPersons(@Query('q') query: string, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'person.search' }, { ownerUserId: req.user.userId, query }),
    );
  }

  @Get('persons/:id')
  async getPerson(@Param('id') id: string, @Req() req: any) {
    const person = await firstValueFrom(
      this.familyClient.send({ cmd: 'person.findById' }, { id }),
    );
    // Apply privacy filtering
    return firstValueFrom(
      this.privacyClient.send({ cmd: 'privacy.filterPerson' }, { person, viewerUserId: req.user.userId }),
    );
  }

  @Patch('persons/:id')
  async updatePerson(@Param('id') id: string, @Body() dto: UpdatePersonDto, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'person.update' }, { id, dto, userId: req.user.userId }),
    );
  }

  @Delete('persons/:id')
  async deletePerson(@Param('id') id: string, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'person.delete' }, { id, userId: req.user.userId }),
    );
  }

  @Post('persons/:id/restore')
  async restorePerson(@Param('id') id: string, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'person.restore' }, { id, userId: req.user.userId }),
    );
  }

  @Post('persons/:id/confirm')
  async confirmPerson(@Param('id') id: string, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'person.confirm' }, { personId: id, linkedUserId: req.user.userId }),
    );
  }

  // --- Tree ---
  @Get('tree')
  async getFullTree(@Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'tree.getFullTree' }, { ownerUserId: req.user.userId }),
    );
  }

  @Get('tree/ancestors/:personId')
  async getAncestors(@Param('personId') personId: string, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'tree.getAncestors' }, { ownerUserId: req.user.userId, personId }),
    );
  }

  @Get('tree/descendants/:personId')
  async getDescendants(@Param('personId') personId: string, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'tree.getDescendants' }, { ownerUserId: req.user.userId, personId }),
    );
  }

  // --- Relationships ---
  @Post('relationships/couple')
  async createCoupleRelationship(@Body() dto: CreateCoupleRelationshipDto, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'couple.create' }, { dto, userId: req.user.userId }),
    );
  }

  @Delete('relationships/couple/:id')
  async deleteCoupleRelationship(@Param('id') id: string, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'couple.delete' }, { id, userId: req.user.userId }),
    );
  }

  @Post('relationships/parent-child')
  async createParentChild(@Body() dto: CreateParentChildDto, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'parentChild.create' }, { dto, userId: req.user.userId }),
    );
  }

  @Delete('relationships/parent-child/:id')
  async deleteParentChild(@Param('id') id: string, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'parentChild.delete' }, { id, userId: req.user.userId }),
    );
  }

  // --- Change Requests ---
  @Get('change-requests')
  async getChangeRequests(@Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'changeRequest.findByTreeOwner' }, { treeOwnerUserId: req.user.userId }),
    );
  }

  @Post('change-requests')
  async createChangeRequest(
    @Body() body: { targetPersonId: string; treeOwnerUserId: string; proposedChanges: Record<string, unknown> },
    @Req() req: any,
  ) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'changeRequest.create' }, {
        ...body,
        requesterUserId: req.user.userId,
      }),
    );
  }

  @Patch('change-requests/:id/approve')
  async approveChangeRequest(@Param('id') id: string, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'changeRequest.approve' }, { id, userId: req.user.userId }),
    );
  }

  @Patch('change-requests/:id/reject')
  async rejectChangeRequest(@Param('id') id: string, @Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'changeRequest.reject' }, { id, userId: req.user.userId }),
    );
  }

  // --- Map ---
  @Get('map/relatives')
  async getRelativesMap(@Req() req: any) {
    return firstValueFrom(
      this.familyClient.send({ cmd: 'map.getRelatives' }, { ownerUserId: req.user.userId }),
    );
  }
}
