import { PixConfig } from "./users";

export type ServiceType = 'carona' | 'carro' | 'moto' | 'van' | 'frete';
export type AvailabilityStatus = 'online' | 'disponivel_hoje' | 'indisponivel';

export interface RideRoute {
  origin: string;
  destination: string;
}

export interface RideDriver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  bairro: string;
  serviceType: ServiceType;
  availabilityStatus: AvailabilityStatus;
  routes: RideRoute[];
  notes?: string;
  price?: string;
  pixConfig?: PixConfig;
  // Visual/Mock data for map
  approximateLat?: number;
  approximateLng?: number;
  mapZone?: string;
  locationNote?: string;
}

