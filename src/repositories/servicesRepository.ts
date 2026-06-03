import { ServiceProvider, ServiceCategory } from "@/types/services";
import { initialServices } from "@/data/services";

const STORAGE_KEY = "axei_services";

export const servicesRepository = {
  getAll: (): ServiceProvider[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialServices;
    return JSON.parse(stored);
  },

  save: (service: ServiceProvider) => {
    const services = servicesRepository.getAll();
    const index = services.findIndex(s => s.id === service.id);
    if (index !== -1) {
      services[index] = service;
    } else {
      services.push(service);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  },

  delete: (id: string) => {
    const services = servicesRepository.getAll().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  },

  formatWhatsAppLink: (phone: string, message: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const prefix = cleanPhone.startsWith('55') ? '' : '55';
    return `https://wa.me/${prefix}${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
};
