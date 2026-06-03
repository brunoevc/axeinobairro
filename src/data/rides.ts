import { RideDriver } from '../types/rides';

export const mockRides: RideDriver[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '11999999999',
    vehicle: 'Fiat Uno 2015',
    bairro: 'Centro',
    serviceType: 'carona',
    availabilityStatus: 'online',
    routes: [{ origin: 'Centro', destination: 'Jardins' }],
    notes: 'Disponível para trajetos curtos.',
    price: 'R$ 15,00'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    phone: '11988888888',
    vehicle: 'Honda CG 160',
    bairro: 'Vila Madalena',
    serviceType: 'moto',
    availabilityStatus: 'disponivel_hoje',
    routes: [{ origin: 'Vila Madalena', destination: 'Pinheiros' }],
    notes: 'Entrega rápida e segura.',
  },
  {
    id: '3',
    name: 'Carlos Souza',
    phone: '11977777777',
    vehicle: 'Kombi 2000',
    bairro: 'Mooca',
    serviceType: 'frete',
    availabilityStatus: 'indisponivel',
    routes: [{ origin: 'Mooca', destination: 'Brás' }],
    notes: 'Fretes para toda a região.',
  }
];
