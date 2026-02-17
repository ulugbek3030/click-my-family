import { Controller, Get, Patch, Delete, Param, Query, UseGuards, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
  ) {}

  @Get()
  async list(@Req() req: any, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    return firstValueFrom(
      this.notificationClient.send({ cmd: 'notification.list' }, {
        userId: req.user.userId,
        limit,
        offset,
      }),
    );
  }

  @Get('unread-count')
  async unreadCount(@Req() req: any) {
    return firstValueFrom(
      this.notificationClient.send({ cmd: 'notification.unreadCount' }, { userId: req.user.userId }),
    );
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: string, @Req() req: any) {
    return firstValueFrom(
      this.notificationClient.send({ cmd: 'notification.markRead' }, { id, userId: req.user.userId }),
    );
  }

  @Patch('read-all')
  async markAllRead(@Req() req: any) {
    return firstValueFrom(
      this.notificationClient.send({ cmd: 'notification.markAllRead' }, { userId: req.user.userId }),
    );
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Req() req: any) {
    return firstValueFrom(
      this.notificationClient.send({ cmd: 'notification.delete' }, { id, userId: req.user.userId }),
    );
  }
}
