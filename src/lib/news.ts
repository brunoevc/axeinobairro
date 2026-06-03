import { NewsItem } from "@/types/news";
import { newsRepository } from "@/repositories/newsRepository";

export const getNews = (): NewsItem[] => {
  return newsRepository.getAll();
};

export const saveNews = (news: NewsItem[]) => {
  newsRepository.saveAll(news);
};

export const trackNewsInteraction = (id: string, type: "view" | "click") => {
  newsRepository.updateInteraction(id, type === "view" ? "views" : "clicks");
};

