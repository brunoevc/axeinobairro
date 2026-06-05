import { Customer } from "@/types/crm";

const STORAGE_KEY = "axei_crm_customers";

export const crmRepository = {
  getAll: (): Customer[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getByMerchant: (merchantId: string): Customer[] => {
    return crmRepository.getAll().filter(c => c.merchantId === merchantId);
  },

  save: (customer: Customer) => {
    const data = crmRepository.getAll();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...data, customer]));
  },

  updateStatus: (id: string, status: Customer["status"]) => {
    const data = crmRepository.getAll();
    const updated = data.map(c => c.id === id ? { ...c, status } : c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  delete: (id: string) => {
    const data = crmRepository.getAll();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.filter(c => c.id !== id)));
  }
};
