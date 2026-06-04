export type CommunityType = 
  | 'religiosa' 
  | 'esportiva' 
  | 'cultural' 
  | 'social' 
  | 'comercial' 
  | 'educacional' 
  | 'geral';

export interface Community {
  id: string;
  name: string;
  type: CommunityType;
  city: string;
  neighborhood?: string;
  description: string;
  leaderUserId?: string;
  phone?: string;
  whatsapp?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
