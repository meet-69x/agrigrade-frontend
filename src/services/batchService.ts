import { apiFetch, getApiUrl } from './api';
import type { BatchRecord, OnionItem, GradeType, DefectType } from '../types';

export interface BackendOnion {
  id: string;
  batch_id: string;
  bbox?: { x: number; y: number; width: number; height: number } | null;
  size_mm?: number | null;
  shape_score?: number | null;
  color_uniformity?: number | null;
  predicted_grade?: string | null;
  defect_tags?: string[];
  confidence?: number | null;
  final_grade?: string | null;
  override_reason?: string | null;
}

export interface BackendBatchSummary {
  id: string;
  label?: string | null;
  centre_id: string;
  status: string;
  onion_count: number;
  avg_size_mm?: number | null;
  overall_grade?: string | null;
  percent_defective?: number | null;
  created_at: string;
}

export interface BackendBatchDetail extends BackendBatchSummary {
  image_path?: string | null;
  onions: BackendOnion[];
}

export function adaptBackendOnionToFrontend(onion: BackendOnion, index: number, defaultImageUrl?: string): OnionItem {
  const defects: DefectType[] = onion.defect_tags && onion.defect_tags.length > 0
    ? (onion.defect_tags as DefectType[])
    : ['None'];

  let bbox = onion.bbox || {
    x: 10 + (index % 5) * 18,
    y: 15 + Math.floor(index / 5) * 20,
    width: 14,
    height: 16,
  };

  // If bounding box has raw pixel values (>100), normalize to percentage fallback
  if (bbox.x > 100 || bbox.y > 100 || bbox.width > 100 || bbox.height > 100) {
    bbox = {
      x: Math.min(Math.round((bbox.x / 1200) * 100 * 10) / 10, 85),
      y: Math.min(Math.round((bbox.y / 800) * 100 * 10) / 10, 85),
      width: Math.min(Math.round((bbox.width / 1200) * 100 * 10) / 10, 30),
      height: Math.min(Math.round((bbox.height / 800) * 100 * 10) / 10, 30),
    };
  }

  return {
    id: onion.id,
    itemNumber: index + 1,
    diameterMm: onion.size_mm ? Math.round(onion.size_mm * 10) / 10 : 50,
    weightGrams: Math.round((onion.size_mm || 50) * 1.8),
    grade: (onion.predicted_grade || 'B').toUpperCase() as GradeType,
    confidence: onion.confidence ? Math.round(onion.confidence * 1000) / 10 : 92.5,
    defects,
    thumbnailUrl: defaultImageUrl || 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=300&auto=format&fit=crop',
    boundingBox: bbox,
    overriddenGrade: onion.final_grade && onion.final_grade !== onion.predicted_grade
      ? (onion.final_grade.toUpperCase() as GradeType)
      : undefined,
    overrideReason: onion.override_reason || undefined,
  };
}

export function adaptBackendBatchToFrontend(batch: BackendBatchDetail): BatchRecord {
  const cachedImage = typeof window !== 'undefined'
    ? (sessionStorage.getItem(`batch_image_${batch.id}`) || sessionStorage.getItem('latest_upload_image'))
    : null;

  const imageUrl = (batch.id && batch.image_path)
    ? getApiUrl(`/batches/${batch.id}/image`)
    : (cachedImage || 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=1200&auto=format&fit=crop');

  const items = (batch.onions || []).map((o, idx) => adaptBackendOnionToFrontend(o, idx, imageUrl));

  const gradeACount = items.filter((i) => (i.overriddenGrade || i.grade) === 'A').length;
  const gradeBCount = items.filter((i) => (i.overriddenGrade || i.grade) === 'B').length;
  const gradeCCount = items.filter((i) => (i.overriddenGrade || i.grade) === 'C').length;

  return {
    id: batch.id,
    batchNumber: batch.label || `BATCH-${batch.id.slice(0, 8).toUpperCase()}`,
    procurementCentre: 'Procurement Centre',
    centreLocation: 'APMC Yard',
    variety: 'Nashik Red',
    timestamp: new Date(batch.created_at).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    operatorName: 'APMC Operator',
    operatorRole: 'Operator',
    totalCount: batch.onion_count || items.length,
    gradeADistribution: gradeACount,
    gradeBDistribution: gradeBCount,
    gradeCDistribution: gradeCCount,
    overallGrade: (batch.overall_grade || 'A').toUpperCase() as GradeType,
    avgDiameterMm: batch.avg_size_mm ? Math.round(batch.avg_size_mm * 10) / 10 : 52,
    avgWeightGrams: 95,
    totalWeightKg: Math.round((batch.onion_count || items.length) * 0.095 * 10) / 10,
    imageUrl,
    items,
  };
}

export const batchService = {
  async createBatch(centreId: string, label: string | null, imageFile: File): Promise<BatchRecord> {
    const formData = new FormData();
    formData.append('centre_id', centreId);
    if (label) {
      formData.append('label', label);
    }
    formData.append('image', imageFile);

    const backendDetail = await apiFetch<BackendBatchDetail>('/batches', {
      method: 'POST',
      body: formData,
    });

    return adaptBackendBatchToFrontend(backendDetail);
  },

  async getBatches(centreId?: string): Promise<BackendBatchSummary[]> {
    const query = centreId ? `?centre_id=${centreId}` : '';
    return apiFetch<BackendBatchSummary[]>(`/batches${query}`);
  },

  async getBatchDetail(batchId: string): Promise<BatchRecord> {
    const backendDetail = await apiFetch<BackendBatchDetail>(`/batches/${batchId}`);
    return adaptBackendBatchToFrontend(backendDetail);
  },

  async downloadBatchReport(batchId: string): Promise<Blob> {
    return apiFetch<Blob>(`/batches/${batchId}/report`);
  },
};
