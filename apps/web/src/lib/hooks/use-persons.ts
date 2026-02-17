'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { personsApi } from '../api/persons';
import type { CreatePersonInput, UpdatePersonInput } from '../types/person';

export function usePersons() {
  return useQuery({
    queryKey: ['persons'],
    queryFn: personsApi.list,
  });
}

export function usePersonSearch(q: string) {
  return useQuery({
    queryKey: ['persons', 'search', q],
    queryFn: () => personsApi.search(q),
    enabled: q.length > 0,
  });
}

export function usePerson(id: string) {
  return useQuery({
    queryKey: ['persons', id],
    queryFn: () => personsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePersonInput) => personsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      queryClient.invalidateQueries({ queryKey: ['tree'] });
    },
  });
}

export function useUpdatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePersonInput }) =>
      personsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      queryClient.invalidateQueries({ queryKey: ['persons', id] });
      queryClient.invalidateQueries({ queryKey: ['tree'] });
    },
  });
}

export function useDeletePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => personsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      queryClient.invalidateQueries({ queryKey: ['tree'] });
    },
  });
}
