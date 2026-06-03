export type ServiceType = 'carona' | 'frete' | 'moto' | 'van';
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
}
