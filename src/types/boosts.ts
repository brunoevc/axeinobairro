export type BoostLevel = 'A' | 'B' | 'C';
export type BoostTargetType = 'loja' | 'servico' | 'transporte';

export interface LocalBoost {
  id: string;
  targetId: string;
  targetType: BoostTargetType;
  level: BoostLevel;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
