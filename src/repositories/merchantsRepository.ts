import { Merchant, merchants as mockMerchants } from "@/data/merchants";
import { storage } from "./storage";

const STORAGE_KEY = "axei_merchants";

export const merchantsRepository = {
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
  },

  update: (id: string, data: Partial<Merchant>) => {
    const merchants = merchantsRepository.getAll();
    const index = merchants.findIndex(m => m.id === id);
    if (index !== -1) {
      merchants[index] = { ...merchants[index], ...data };
      storage.set(STORAGE_KEY, merchants);
    }
  },

  delete: (id: string) => {
    const merchants = merchantsRepository.getAll().filter(m => m.id !== id);
    storage.set(STORAGE_KEY, merchants);
  }
};

