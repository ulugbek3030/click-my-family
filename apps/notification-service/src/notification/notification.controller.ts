import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InAppService } from './in-app.service';

@Controller()
export class NotificationController {
  constructor(private readonly inAppService: InAppService) {}

  @MessagePattern({ cmd: 'notification.list' })
  async list(data: { userId: string; limit?: number; offset?: number }) {
    return this.inAppService.getByUser(data.userId, data.limit, data.offset);
  }

  @MessagePattern({ cmd: 'notification.unreadCount' })
  async unreadCount(data: { userId: string }) {
    const count = await this.inAppService.getUnreadCount(data.userId);
    return { count };
  }

  @MessagePattern({ cmd: 'notification.markRead' })
  async markRead(data: { id: string; userId: string }) {
    await this.inAppService.markRead(data.id, data.userId);
    return { success: true };
  }

  @MessagePattern({ cmd: 'notification.markAllRead' })
  async markAllRead(data: { userId: string }) {
    await this.inAppService.markAllRead(data.userId);
    return { success: true };
  }

  @MessagePattern({ cmd: 'notification.delete' })
  async delete(data: { id: string; userId: string }) {
    await this.inAppService.delete(data.id, data.userId);
    return { success: true };
  }
}
