'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { relationshipsApi } from '../api/relationships';
import type { CreateCoupleRelationshipInput, CreateParentChildInput } from '../types/relationship';

export function useCreateCouple() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCoupleRelationshipInput) => relationshipsApi.createCouple(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tree'] });
      queryClient.invalidateQueries({ queryKey: ['persons'] });
    },
  });
}

export function useDeleteCouple() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => relationshipsApi.deleteCouple(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tree'] });
    },
  });
}

export function useCreateParentChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateParentChildInput) => relationshipsApi.createParentChild(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tree'] });
      queryClient.invalidateQueries({ queryKey: ['persons'] });
    },
  });
}

export function useDeleteParentChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => relationshipsApi.deleteParentChild(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tree'] });
    },
  });
}
