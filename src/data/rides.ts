import { RideDriver } from '../types/rides';

export const mockRides: RideDriver[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '11999999999',
    vehicle: 'Fiat Uno 2015',
    bairro: 'Centro',
    serviceType: 'carro',
    availabilityStatus: 'online',
    routes: [{ origin: 'Centro', destination: 'Jardins' }],
    notes: 'Disponível para trajetos curtos.',
    price: 'R$ 15,00',
    mapZone: 'Centro',
    locationNote: 'Próximo à Praça Central'
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
    mapZone: 'Vila Madalena',
    locationNote: 'Perto do Metrô'
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
    mapZone: 'Mooca',
    locationNote: 'Atrás da Igreja'
  },
  {
    id: '4',
    name: 'Ana Van',
    phone: '11966666666',
    vehicle: 'Renault Master',
    bairro: 'Jardins',
    serviceType: 'van',
    availabilityStatus: 'online',
    routes: [{ origin: 'Jardins', destination: 'Aeroporto' }],
    notes: 'Van executiva para grupos.',
    mapZone: 'Jardins',
    locationNote: 'Rua Principal'
  }
];