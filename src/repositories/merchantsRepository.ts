import { Merchant, merchants as mockMerchants } from "@/data/merchants";

const STORAGE_KEY = "axei_merchants";

export const merchantsRepository = {
  getAll: (): Merchant[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return mockMerchants;
    return JSON.parse(stored);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merchants));
  },

  update: (id: string, data: Partial<Merchant>) => {
    const merchants = merchantsRepository.getAll();
    const index = merchants.findIndex(m => m.id === id);
    if (index !== -1) {
      merchants[index] = { ...merchants[index], ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merchants));
    }
  },

  delete: (id: string) => {
    const merchants = merchantsRepository.getAll().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merchants));
  }
};
