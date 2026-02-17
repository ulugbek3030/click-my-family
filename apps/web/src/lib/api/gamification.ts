import { api } from './client';
import type { UserScore } from '../types/api';

export const gamificationApi = {
  getScore: () => api.get<UserScore>('/gamification/score'),
  getLevels: () => api.get('/gamification/levels'),
  getHistory: (limit = 20, offset = 0) =>
    api.get(`/gamification/history?limit=${limit}&offset=${offset}`),
};
