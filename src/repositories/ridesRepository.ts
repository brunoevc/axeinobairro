import { RideDriver } from '../types/rides';
import { mockRides } from '../data/rides';

const STORAGE_KEY = 'axe_rides_data';

const getRides = (): RideDriver[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return mockRides;
  return JSON.parse(data);
};

const saveRides = (rides: RideDriver[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rides));
};

export const normalizePhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) return `55${cleaned}`;
  if (cleaned.length === 10) return `5511${cleaned}`;
  return cleaned;
};

export const ridesRepository = {
  list: (): RideDriver[] => getRides(),
  
  getById: (id: string): RideDriver | undefined => getRides().find(r => r.id === id),
  
  create: (ride: RideDriver) => {
    const rides = getRides();
    saveRides([...rides, ride]);
  },
  
  update: (id: string, updatedRide: Partial<RideDriver>) => {
    const rides = getRides();
    saveRides(rides.map(r => r.id === id ? { ...r, ...updatedRide } : r));
  },
  
  delete: (id: string) => {
    const rides = getRides();
    saveRides(rides.filter(r => r.id !== id));
  },
  
  filter: (filters: { origin?: string; destination?: string; serviceType?: string; status?: string }) => {
    let rides = getRides();
    if (filters.origin) rides = rides.filter(r => r.routes.some(route => route.origin.toLowerCase().includes(filters.origin!.toLowerCase())));
    if (filters.destination) rides = rides.filter(r => r.routes.some(route => route.destination.toLowerCase().includes(filters.destination!.toLowerCase())));
    if (filters.serviceType) rides = rides.filter(r => r.serviceType === filters.serviceType);
    if (filters.status) rides = rides.filter(r => r.availabilityStatus === filters.status);
    return rides;
  }
};
