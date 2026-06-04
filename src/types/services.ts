import { PixConfig } from "./users";

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
  verified?: boolean;
  priceNote?: string;
  serviceArea?: string[];
  pixConfig?: PixConfig;
  createdAt: string;
  updatedAt: string;
}

