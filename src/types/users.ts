export type UserRole = 
  | 'master_admin' 
  | 'lojista' 
  | 'profissional' 
  | 'motorista' 
  | 'representante' 
  | 'morador'
  | 'lider_comunidade';

export type Interest = 
  | 'negocios' | 'servicos' | 'transporte' | 'noticias' | 'eventos' 
  | 'empregos' | 'classificados' | 'acoes_sociais' | 'eventos_religiosos' 
  | 'esportes' | 'educacao' | 'cultura';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  linkedMerchantId?: string;
  linkedServiceId?: string;
  linkedDriverId?: string;
  linkedRepresentativeId?: string;
  neighborhood?: string;
  city?: string;
  interests?: Interest[];
  communityType?: 'religiosa' | 'esportiva' | 'cultural' | 'social' | 'comercial' | 'educacional' | 'geral';
  faithCommunity?: string;
  followedCommunities?: string[];
  mustChangePassword?: boolean;
  createdAt: string;
  updatedAt: string;
}

