import { api } from './client';
import type { CreateCoupleRelationshipInput, CreateParentChildInput } from '../types/relationship';

export const relationshipsApi = {
  createCouple: (data: CreateCoupleRelationshipInput) =>
    api.post('/relationships/couple', data),
  deleteCouple: (id: string) => api.delete(`/relationships/couple/${id}`),
  createParentChild: (data: CreateParentChildInput) =>
    api.post('/relationships/parent-child', data),
  deleteParentChild: (id: string) => api.delete(`/relationships/parent-child/${id}`),
};
