import { Controller, Get, Post, Body, Query, UseGuards, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SelectTransferRelativeDto, ExecuteTransferDto } from '@my-family/shared-dto';

@ApiTags('Transfer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transfer')
export class TransferController {
  constructor(
    @Inject('TRANSFER_SERVICE') private readonly transferClient: ClientProxy,
  ) {}

  @Get('selection')
  async getSelection(@Req() req: any) {
    return firstValueFrom(
      this.transferClient.send({ cmd: 'transfer.getSelection' }, { userId: req.user.userId }),
    );
  }

  @Post('selection')
  async selectRelative(@Body() dto: SelectTransferRelativeDto, @Req() req: any) {
    return firstValueFrom(
      this.transferClient.send({ cmd: 'transfer.selectRelative' }, {
        userId: req.user.userId,
        selectedPersonId: dto.personId,
        selectedUserId: req.user.userId, // Will be resolved by the service
      }),
    );
  }

  @Post('execute')
  async executeTransfer(@Body() dto: ExecuteTransferDto, @Req() req: any) {
    return firstValueFrom(
      this.transferClient.send({ cmd: 'transfer.execute' }, {
        senderUserId: req.user.userId,
        amount: dto.amount,
      }),
    );
  }

  @Get('limit')
  async getLimit(@Req() req: any) {
    return firstValueFrom(
      this.transferClient.send({ cmd: 'transfer.getLimit' }, { userId: req.user.userId }),
    );
  }

  @Get('history')
  async getHistory(@Req() req: any, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    return firstValueFrom(
      this.transferClient.send({ cmd: 'transfer.getHistory' }, {
        userId: req.user.userId,
        limit,
        offset,
      }),
    );
  }
}
