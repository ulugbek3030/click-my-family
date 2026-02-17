import { Controller, Get, Put, Param, Body, UseGuards, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdatePrivacySettingsDto } from '@my-family/shared-dto';

@ApiTags('Privacy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('privacy')
export class PrivacyController {
  constructor(
    @Inject('PRIVACY_SERVICE') private readonly privacyClient: ClientProxy,
  ) {}

  @Get('settings/:personId')
  async getSettings(@Param('personId') personId: string, @Req() req: any) {
    return firstValueFrom(
      this.privacyClient.send({ cmd: 'privacy.getSettings' }, {
        personId,
        ownerUserId: req.user.userId,
      }),
    );
  }

  @Put('settings/:personId')
  async updateSettings(
    @Param('personId') personId: string,
    @Body() dto: UpdatePrivacySettingsDto,
    @Req() req: any,
  ) {
    return firstValueFrom(
      this.privacyClient.send({ cmd: 'privacy.updateSettings' }, {
        personId,
        ownerUserId: req.user.userId,
        dto,
      }),
    );
  }
}
