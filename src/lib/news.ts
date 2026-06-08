import { NewsItem } from "@/types/news";
import { newsRepository } from "@/repositories/newsRepository";

// Compatibility layer for Phase 12.0A
export const getNews = async (): Promise<NewsItem[]> => {
  return await newsRepository.getAll();
};

export const saveNews = async (news: NewsItem[]) => {
  // Not implemented for real DB yet, but keeping the signature
  console.log("saveNews called with:", news);
};

export const trackNewsInteraction = async (id: string, type: "view" | "click") => {
  return await newsRepository.updateInteraction(id, type === 'view' ? 'views' : 'clicks');
};

// Re-export original functions for components that haven't been migrated to async yet
export const getAllNews = getNews;
export const updateNewsInteraction = trackNewsInteraction;
