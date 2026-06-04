import { Merchant, merchants as mockMerchants } from "@/data/merchants";
import { storage } from "./storage";

const STORAGE_KEY = "axei_merchants";

type Listener = () => void;
const listeners: Listener[] = [];

export const merchantsRepository = {
  subscribe: (listener: Listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) listeners.splice(index, 1);
    };
  },
  
  notify: () => {
    listeners.forEach(l => l());
  },

  getAll: (): Merchant[] => {
    return storage.get(STORAGE_KEY, mockMerchants);
  },

  getById: (id: string): Merchant | undefined => {
    return merchantsRepository.getAll().find(m => m.id === id);
  },

  getBySlug: (slug: string): Merchant | undefined => {
    return merchantsRepository.getAll().find(m => m.slug === slug);
  },

  save: (merchant: Merchant) => {
    const merchants = merchantsRepository.getAll();
    const index = merchants.findIndex(m => m.id === merchant.id);
    if (index !== -1) {
      merchants[index] = merchant;
    } else {
      merchants.push(merchant);
    }
    storage.set(STORAGE_KEY, merchants);
    merchantsRepository.notify();
  },

  update: (id: string, data: Partial<Merchant>) => {
    const merchants = merchantsRepository.getAll();
    const index = merchants.findIndex(m => m.id === id);
    if (index !== -1) {
      merchants[index] = { ...merchants[index], ...data };
      storage.set(STORAGE_KEY, merchants);
      merchantsRepository.notify();
    }
  },

  delete: (id: string) => {
    const merchants = merchantsRepository.getAll().filter(m => m.id !== id);
    storage.set(STORAGE_KEY, merchants);
    merchantsRepository.notify();
  }
};


