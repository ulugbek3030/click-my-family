import { api } from './client';
import type { Person, CreatePersonInput, UpdatePersonInput } from '../types/person';

export const personsApi = {
  list: () => api.get<Person[]>('/persons'),
  search: (q: string) => api.get<Person[]>(`/persons/search?q=${encodeURIComponent(q)}`),
  getById: (id: string) => api.get<Person>(`/persons/${id}`),
  create: (data: CreatePersonInput) => api.post<Person>('/persons', data),
  update: (id: string, data: UpdatePersonInput) => api.patch<Person>(`/persons/${id}`, data),
  delete: (id: string) => api.delete(`/persons/${id}`),
  restore: (id: string) => api.post<Person>(`/persons/${id}/restore`),
  confirm: (id: string) => api.post<Person>(`/persons/${id}/confirm`),
};
