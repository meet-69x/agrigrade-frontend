export type GradeType = 'A' | 'B' | 'C';

export type UserRole = 'Operator' | 'Procurement Manager' | 'Quality Auditor' | 'Admin';

export type DefectType = 
  | 'Sprouting' 
  | 'Root Rot' 
  | 'Skin Tear' 
  | 'Mechanical Cut' 
  | 'Sunburn / Discoloration' 
  | 'Double Bulb' 
  | 'Fungal Spot' 
  | 'None';

export interface BoundingBox {
  x: number;     // percentage 0-100
  y: number;     // percentage 0-100
  width: number;  // percentage 0-100
  height: number; // percentage 0-100
}

export interface OnionItem {
  id: string;
  itemNumber: number;
  diameterMm: number;
  weightGrams: number;
  grade: GradeType;
  confidence: number; // e.g. 96.8
  defects: DefectType[];
  thumbnailUrl: string;
  boundingBox: BoundingBox;
  overriddenGrade?: GradeType;
  overrideReason?: string;
}

export interface BatchRecord {
  id: string;
  batchNumber: string;
  procurementCentre: string;
  centreLocation: string;
  variety: 'Red Globe' | 'Yellow Granex' | 'White Spanish' | 'Nashik Red';
  timestamp: string;
  operatorName: string;
  operatorRole: UserRole;
  totalCount: number;
  gradeADistribution: number; // count
  gradeBDistribution: number; // count
  gradeCDistribution: number; // count
  overallGrade: GradeType;
  avgDiameterMm: number;
  avgWeightGrams: number;
  totalWeightKg: number;
  imageUrl: string;
  items: OnionItem[];
  notes?: string;
}

export interface ProcurementCentre {
  id: string;
  name: string;
  location: string;
  state: string;
  activeLines: number;
  dailyCapacityTons: number;
}
