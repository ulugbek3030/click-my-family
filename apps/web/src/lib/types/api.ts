export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface UserScore {
  userId: string;
  totalPoints: number;
  currentLevel: number;
  levelName: string;
  relativesAdded: number;
  relativesConfirmed: number;
  maxRelatives: number;
  isPremium: boolean;
  nextLevelPoints?: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  actionType?: string;
  actionPayload?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface UnreadCount {
  count: number;
}
