import { NewsItem } from "@/types/news";

const STORAGE_KEY = "axei_news_data";

export const newsRepository = {
  getAll: (): NewsItem[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAll: (news: NewsItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(news));
  },

  updateInteraction: (id: string, type: "views" | "clicks") => {
    const news = newsRepository.getAll();
    const updated = news.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [type]: (item[type] || 0) + 1
        };
      }
      return item;
    });
    newsRepository.saveAll(updated);
  }
};
