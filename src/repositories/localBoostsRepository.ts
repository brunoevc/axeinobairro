import { LocalBoost, BoostTargetType } from "@/types/boosts";
import { mockBoosts } from "@/data/boosts";

const STORAGE_KEY = "axei_local_boosts";

export const localBoostsRepository = {
  getAll: (): LocalBoost[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return mockBoosts;
    return JSON.parse(stored);
  },

  getActiveBoosts: (): LocalBoost[] => {
    const now = new Date();
    const boosts = localBoostsRepository.getAll();
    
    // Filter active and within date range
    const active = boosts.filter(b => 
      b.isActive && 
      new Date(b.startDate) <= now && 
      new Date(b.endDate) >= now
    );

    // Rule: if multiple boosts for the same item, keep only the highest level
    // Hierarchy: A > B > C
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

  save: (boost: LocalBoost) => {
    const boosts = localBoostsRepository.getAll();
    const index = boosts.findIndex(b => b.id === boost.id);
    
    const updatedBoost = {
      ...boost,
      updatedAt: new Date().toISOString()
    };

    if (index !== -1) {
      boosts[index] = updatedBoost;
    } else {
      boosts.push(updatedBoost);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boosts));
  },

  delete: (id: string) => {
    const boosts = localBoostsRepository.getAll().filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boosts));
  }
};
