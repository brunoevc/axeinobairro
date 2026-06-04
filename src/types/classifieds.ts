export type ClassifiedCategory = 
  | 'imóveis' 
  | 'veículos' 
  | 'casa & eletro' 
  | 'eletrônicos' 
  | 'moda & beleza' 
  | 'hobby & lazer' 
  | 'diversos';

export interface ClassifiedAd {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  price: number;
  category: ClassifiedCategory;
  neighborhood: string;
  images: string[];
  whatsapp: string;
  status: 'active' | 'sold' | 'expired' | 'blocked';
  planType: 'free' | 'community';
  views: number;
  reports: number;
  createdAt: string;
  expiresAt: string;
}

export interface ClassifiedReport {
  id: string;
  adId: string;
  reason: string;
  createdAt: string;
}
