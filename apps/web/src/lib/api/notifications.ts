import { api } from './client';
import type { Notification, UnreadCount, PaginatedResult } from '../types/api';

export const notificationsApi = {
  list: (limit = 20, offset = 0) =>
    api.get<PaginatedResult<Notification>>(`/notifications?limit=${limit}&offset=${offset}`),
  unreadCount: () => api.get<UnreadCount>('/notifications/unread-count'),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
};
