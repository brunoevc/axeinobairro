import { NewsItem } from "@/types/news";
import { newsRepository } from "@/repositories/newsRepository";

// This is a bridge for Phase 12.0A to handle async repo calls in existing components
// until we fully migrate components to use TanStack Query or direct repo calls.

export const getAllNews = async (): Promise<NewsItem[]> => {
  return await newsRepository.getAll();
};

export const updateNewsInteraction = async (id: string, type: "views" | "clicks") => {
  return await newsRepository.updateInteraction(id, type);
};
