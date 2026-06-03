import { ServiceProvider, ServiceCategory } from "@/types/services";
import { initialServices } from "@/data/services";

const STORAGE_KEY = "axei_services";

export const servicesRepository = {
  getAll: (): ServiceProvider[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialServices;
    return JSON.parse(stored);
  },

  normalizePhone: (phone: string) => {
    const clean = phone.replace(/\D/g, '');
    return clean.startsWith('55') ? clean : `55${clean}`;
  },

  validate: (service: Partial<ServiceProvider>): string | null => {
    if (!service.name?.trim()) return "Nome é obrigatório";
    if (!service.category) return "Categoria é obrigatória";
    if (!service.neighborhood?.trim()) return "Bairro é obrigatório";
    const phone = service.phone?.replace(/\D/g, '');
    if (!phone || phone.length < 10) return "Telefone inválido";
    return null;
  },

  save: (service: ServiceProvider) => {
    const error = servicesRepository.validate(service);
    if (error) throw new Error(error);

    const services = servicesRepository.getAll();
    const index = services.findIndex(s => s.id === service.id);
    
    const normalizedService = {
      ...service,
      phone: servicesRepository.normalizePhone(service.phone)
    };

    if (index !== -1) {
      services[index] = normalizedService;
    } else {
      services.push(normalizedService);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  },

  delete: (id: string) => {
    const services = servicesRepository.getAll().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  },

  formatWhatsAppLink: (phone: string, message: string) => {
    const cleanPhone = servicesRepository.normalizePhone(phone);
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
};
