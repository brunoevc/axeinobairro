import { Recommendation, RecommendationCategory } from "@/types/recommendations";
import { storage } from "./storage";

const STORAGE_KEY = "axei_recommendations";

// Initial mock data
const initialRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Kindle 11ª Geração",
    description: "O leitor de livros digitais mais amado do mundo, agora mais leve e com tela de alta resolução.",
    category: "tecnologia",
    imageUrl: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=60",
    affiliateUrl: "https://amzn.to/example",
    sourceName: "Amazon",
    priceNote: "A partir de R$ 499",
    isActive: true,
    isSponsored: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Kit de Ferramentas Bosch",
    description: "Maleta completa com 41 peças para manutenção residencial e profissional.",
    category: "ferramentas",
    imageUrl: "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=800&auto=format&fit=crop&q=60",
    affiliateUrl: "https://amzn.to/example-bosch",
    sourceName: "Amazon",
    priceNote: "Melhor preço do mês",
    isActive: true,
    isSponsored: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Curso de Marketing Digital",
    description: "Aprenda a vender mais usando as redes sociais com este guia passo a passo.",
    category: "cursos",
    imageUrl: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c20e?w=800&auto=format&fit=crop&q=60",
    affiliateUrl: "https://hotmart.com/example",
    sourceName: "Hotmart",
    priceNote: "Promoção de lançamento",
    isActive: true,
    isSponsored: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

type Listener = () => void;
const listeners: Listener[] = [];

export const recommendationsRepository = {
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

  getAll: (): Recommendation[] => {
    return storage.get(STORAGE_KEY, initialRecommendations);
  },

  getActive: (): Recommendation[] => {
    return recommendationsRepository.getAll().filter(r => r.isActive);
  },

  getByCategory: (category: RecommendationCategory | 'all'): Recommendation[] => {
    const all = recommendationsRepository.getActive();
    if (category === 'all') return all;
    return all.filter(r => r.category === category);
  },

  create: (data: Omit<Recommendation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const all = recommendationsRepository.getAll();
    const newRecommendation: Recommendation = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    all.push(newRecommendation);
    storage.set(STORAGE_KEY, all);
    recommendationsRepository.notify();
    return newRecommendation;
  },

  update: (id: string, data: Partial<Recommendation>) => {
    const all = recommendationsRepository.getAll();
    const index = all.findIndex(r => r.id === id);
    if (index !== -1) {
      all[index] = { 
        ...all[index], 
        ...data, 
        updatedAt: new Date().toISOString() 
      };
      storage.set(STORAGE_KEY, all);
      recommendationsRepository.notify();
    }
  },

  delete: (id: string) => {
    const all = recommendationsRepository.getAll().filter(r => r.id !== id);
    storage.set(STORAGE_KEY, all);
    recommendationsRepository.notify();
  }
};
