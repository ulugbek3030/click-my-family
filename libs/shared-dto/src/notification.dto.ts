export class InAppNotificationResponseDto {
  id: string;
  title: string;
  body: string;
  actionType?: string;
  actionPayload?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export class UnreadCountResponseDto {
  count: number;
}
