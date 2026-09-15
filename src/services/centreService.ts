import { apiFetch } from './api';

export interface BackendCentre {
  id: string;
  name: string;
  location?: string;
  created_at?: string;
}

export const centreService = {
  async getCentres(): Promise<BackendCentre[]> {
    return apiFetch<BackendCentre[]>('/centres');
  },

  async createCentre(name: string, location?: string): Promise<BackendCentre> {
    return apiFetch<BackendCentre>('/centres', {
      method: 'POST',
      body: JSON.stringify({ name, location }),
    });
  },
};
