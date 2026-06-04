export type ReviewTargetType = 'loja' | 'servico' | 'transporte';

export interface Review {
  id: string;
  targetId: string;
  targetType: ReviewTargetType;
  authorName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  isVisible: boolean;
}
