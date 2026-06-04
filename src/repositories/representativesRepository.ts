import { Representative } from "@/types/representatives";
import { initialRepresentatives } from "@/data/representatives";

const STORAGE_KEY = "axei_representatives_data";

export const representativesRepository = {
  getAll: (): Representative[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initialRepresentatives;
  },

  saveAll: (reps: Representative[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reps));
  }
};