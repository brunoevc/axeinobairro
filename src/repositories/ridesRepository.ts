import { RideDriver } from '../types/rides';
import { mockRides } from '../data/rides';
import { storage } from "./storage";

const STORAGE_KEY = 'axei_rides_data';

export const normalizePhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
};

export const ridesRepository = {
  list: (): RideDriver[] => storage.get(STORAGE_KEY, mockRides),
  
  getById: (id: string): RideDriver | undefined => ridesRepository.list().find(r => r.id === id),
  
  create: (ride: RideDriver) => {
    const rides = ridesRepository.list();
    storage.set(STORAGE_KEY, [...rides, ride]);
  },
  
  update: (id: string, updatedRide: Partial<RideDriver>) => {
    const rides = ridesRepository.list();
    storage.set(STORAGE_KEY, rides.map(r => r.id === id ? { ...r, ...updatedRide } : r));
  },
  
  delete: (id: string) => {
    const rides = ridesRepository.list();
    storage.set(STORAGE_KEY, rides.filter(r => r.id !== id));
  },
  
  filter: (filters: { origin?: string; destination?: string; serviceType?: string; status?: string }) => {
    let rides = ridesRepository.list();
    if (filters.origin) rides = rides.filter(r => r.routes.some(route => route.origin.toLowerCase().includes(filters.origin!.toLowerCase())));
    if (filters.destination) rides = rides.filter(r => r.routes.some(route => route.destination.toLowerCase().includes(filters.destination!.toLowerCase())));
    if (filters.serviceType) rides = rides.filter(r => r.serviceType === filters.serviceType);
    if (filters.status) rides = rides.filter(r => r.availabilityStatus === filters.status);
    return rides;
  }
};

