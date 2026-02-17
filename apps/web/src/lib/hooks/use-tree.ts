'use client';

import { useQuery } from '@tanstack/react-query';
import { treeApi } from '../api/tree';

export function useFamilyTree() {
  return useQuery({
    queryKey: ['tree'],
    queryFn: treeApi.getTree,
  });
}
