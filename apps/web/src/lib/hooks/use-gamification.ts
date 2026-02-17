'use client';

import { useQuery } from '@tanstack/react-query';
import { gamificationApi } from '../api/gamification';

export function useUserScore() {
  return useQuery({
    queryKey: ['gamification', 'score'],
    queryFn: gamificationApi.getScore,
  });
}
