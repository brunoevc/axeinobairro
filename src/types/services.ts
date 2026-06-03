export type ServiceCategory = 
  | 'eletricista' 
  | 'encanador' 
  | 'pedreiro' 
  | 'pintor' 
  | 'diarista' 
  | 'jardineiro' 
  | 'montador de móveis' 
  | 'técnico de informática' 
  | 'técnico de celular' 
  | 'chaveiro' 
  | 'costureira' 
  | 'professor particular' 
  | 'cuidador de idosos' 
  | 'passeador de cães';

export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceCategory;
  phone: string;
  neighborhood: string;
  description: string;
  isAvailable: boolean;
  rating?: number;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}
