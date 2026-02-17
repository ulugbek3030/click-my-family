import { api } from './client';
import type { FamilyTree } from '../types/tree';

export const treeApi = {
  getTree: () => api.get<FamilyTree>('/tree'),
  getAncestors: (personId: string) => api.get(`/tree/ancestors/${personId}`),
  getDescendants: (personId: string) => api.get(`/tree/descendants/${personId}`),
};
