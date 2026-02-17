import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PushNotificationRequest {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class ClickPushClient {
  private readonly logger = new Logger(ClickPushClient.name);
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get('CLICK_CORE_BASE_URL', 'https://api.click.uz/core/v1');
  }

  async sendPush(request: PushNotificationRequest): Promise<boolean> {
    try {
      // In production: POST ${this.baseUrl}/notifications/push
      this.logger.log(`Sending push to user: ${request.userId}, title: ${request.title}`);
      return true;
    } catch (error) {
      this.logger.error('Push notification failed', error);
      return false;
    }
  }

  async sendBulkPush(requests: PushNotificationRequest[]): Promise<void> {
    // In production: POST ${this.baseUrl}/notifications/push/bulk
    this.logger.log(`Sending bulk push to ${requests.length} users`);
    for (const request of requests) {
      await this.sendPush(request);
    }
  }
}
