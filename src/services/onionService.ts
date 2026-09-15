import { apiFetch } from './api';
import type { BackendOnion } from './batchService';

export interface OverridePayload {
  final_grade: string;
  override_reason: string;
}

export const onionService = {
  async overrideGrade(onionId: string, payload: OverridePayload): Promise<BackendOnion> {
    return apiFetch<BackendOnion>(`/onions/${onionId}/override`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
