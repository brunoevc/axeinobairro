export type RecommendationCategory = 
  | 'casa' 
  | 'tecnologia' 
  | 'beleza' 
  | 'cozinha' 
  | 'ferramentas' 
  | 'cursos' 
  | 'serviços online' 
  | 'ofertas' 
  | 'outros';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: RecommendationCategory;
  imageUrl?: string;
  affiliateUrl: string;
  sourceName?: string;
  priceNote?: string;
  isActive: boolean;
  isSponsored?: boolean;
  createdAt: string;
  updatedAt: string;
}
