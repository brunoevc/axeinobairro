export type UserRole = 
  | 'master_admin' 
  | 'lojista' 
  | 'profissional' 
  | 'motorista' 
  | 'representante' 
  | 'morador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Temporário para o mock
  linkedMerchantId?: string;
  linkedServiceId?: string;
  linkedDriverId?: string;
  linkedRepresentativeId?: string;
  mustChangePassword?: boolean;
  createdAt: string;
  updatedAt: string;
}
