import { LocalBoost, BoostTargetType } from "@/types/boosts";
import { mockBoosts } from "@/data/boosts";
import { storage } from "./storage";

const STORAGE_KEY = "axei_local_boosts";

export const localBoostsRepository = {
  getAll: (): LocalBoost[] => {
    return storage.get(STORAGE_KEY, mockBoosts);
  },

  getActiveBoosts: (): LocalBoost[] => {
    const now = new Date();
    const boosts = localBoostsRepository.getAll();
    
    const active = boosts.filter(b => 
      b.isActive && 
      new Date(b.startDate) <= now && 
      new Date(b.endDate) >= now
    );

    const levelWeight = { 'A': 3, 'B': 2, 'C': 1 };
    const uniqueBoosts: Record<string, LocalBoost> = {};
    
    active.forEach(boost => {
      const key = `${boost.targetType}-${boost.targetId}`;
      if (!uniqueBoosts[key] || levelWeight[boost.level] > levelWeight[uniqueBoosts[key].level]) {
        uniqueBoosts[key] = boost;
      }
    });

    return Object.values(uniqueBoosts).sort((a, b) => 
      levelWeight[b.level] - levelWeight[a.level]
    );
  },

  getActiveBoostsByType: (type: BoostTargetType): LocalBoost[] => {
    return localBoostsRepository.getActiveBoosts().filter(b => b.targetType === type);
  },

  getActiveBoostForTarget: (targetType: BoostTargetType, targetId: string): LocalBoost | undefined => {
    return localBoostsRepository.getActiveBoosts().find(b => 
      b.targetType === targetType && b.targetId === targetId
    );
  },

  sortByBoost: <T>(items: T[], targetType: BoostTargetType, idField: keyof T): T[] => {
    const activeBoosts = localBoostsRepository.getActiveBoostsByType(targetType);
    const levelWeight: Record<string, number> = { 'A': 3, 'B': 2, 'C': 1, 'none': 0 };

    return [...items].sort((a, b) => {
      const idA = String(a[idField]);
      const idB = String(b[idField]);
      
      const boostA = activeBoosts.find(boost => boost.targetId === idA);
      const boostB = activeBoosts.find(boost => boost.targetId === idB);
      
      const weightA = boostA ? (levelWeight[boostA.level] || 0) : levelWeight.none;
      const weightB = boostB ? (levelWeight[boostB.level] || 0) : levelWeight.none;

      return weightB - weightA;
    });
  },

  save: (boost: LocalBoost) => {
    const boosts = localBoostsRepository.getAll();
    const index = boosts.findIndex(b => b.id === boost.id);
    const updatedBoost = { ...boost, updatedAt: new Date().toISOString() };

    if (index !== -1) {
      boosts[index] = updatedBoost;
    } else {
      boosts.push(updatedBoost);
    }
    storage.set(STORAGE_KEY, boosts);
  },

  delete: (id: string) => {
    const boosts = localBoostsRepository.getAll().filter(b => b.id !== id);
    storage.set(STORAGE_KEY, boosts);
  }
};

