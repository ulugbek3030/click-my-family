import { Controller, Get, Post, Query, UseGuards, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Gamification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gamification')
export class GamificationController {
  constructor(
    @Inject('GAMIFICATION_SERVICE') private readonly gamificationClient: ClientProxy,
  ) {}

  @Get('score')
  async getScore(@Req() req: any) {
    return firstValueFrom(
      this.gamificationClient.send({ cmd: 'gamification.getScore' }, { userId: req.user.userId }),
    );
  }

  @Get('levels')
  async getLevels() {
    return firstValueFrom(
      this.gamificationClient.send({ cmd: 'gamification.getLevels' }, {}),
    );
  }

  @Get('history')
  async getHistory(@Req() req: any, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    return firstValueFrom(
      this.gamificationClient.send({ cmd: 'gamification.getHistory' }, {
        userId: req.user.userId,
        limit,
        offset,
      }),
    );
  }

  @Post('upgrade')
  async upgradePremium(@Req() req: any) {
    return firstValueFrom(
      this.gamificationClient.send({ cmd: 'gamification.upgradePremium' }, { userId: req.user.userId }),
    );
  }
}
