import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Inject, Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SendCardDto } from '@my-family/shared-dto';

@ApiTags('Cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardsController {
  constructor(
    @Inject('CARDS_SERVICE') private readonly cardsClient: ClientProxy,
  ) {}

  @Get('templates')
  async getTemplates() {
    return firstValueFrom(
      this.cardsClient.send({ cmd: 'cards.templates.list' }, {}),
    );
  }

  @Get('templates/:id')
  async getTemplate(@Param('id') id: string) {
    return firstValueFrom(
      this.cardsClient.send({ cmd: 'cards.templates.getById' }, { id }),
    );
  }

  @Post('send')
  async sendCard(@Body() dto: SendCardDto, @Req() req: any) {
    return firstValueFrom(
      this.cardsClient.send({ cmd: 'cards.send' }, {
        senderUserId: req.user.userId,
        templateId: dto.templateId,
        receiverUserId: dto.receiverUserId,
        personalMessage: dto.personalMessage,
      }),
    );
  }

  @Get('sent')
  async getSentCards(@Req() req: any, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    return firstValueFrom(
      this.cardsClient.send({ cmd: 'cards.sent' }, { userId: req.user.userId, limit, offset }),
    );
  }

  @Get('received')
  async getReceivedCards(@Req() req: any, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    return firstValueFrom(
      this.cardsClient.send({ cmd: 'cards.received' }, { userId: req.user.userId, limit, offset }),
    );
  }

  @Get('received/unread')
  async getUnreadCards(@Req() req: any) {
    return firstValueFrom(
      this.cardsClient.send({ cmd: 'cards.unread' }, { userId: req.user.userId }),
    );
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: string, @Req() req: any) {
    return firstValueFrom(
      this.cardsClient.send({ cmd: 'cards.markRead' }, { id, userId: req.user.userId }),
    );
  }

  @Delete(':id')
  async deleteCard(@Param('id') id: string, @Req() req: any) {
    return firstValueFrom(
      this.cardsClient.send({ cmd: 'cards.delete' }, { id, userId: req.user.userId }),
    );
  }
}
