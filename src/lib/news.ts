import { NewsItem } from "@/types/news";

const STORAGE_KEY = "axei_news_data";

export const getNews = (): NewsItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveNews = (news: NewsItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(news));
};

export const trackNewsInteraction = (id: string, type: "view" | "click") => {
  const news = getNews();
  const updated = news.map(item => {
    if (item.id === id) {
      return {
        ...item,
        [type === "view" ? "views" : "clicks"]: (item[type === "view" ? "views" : "clicks"] || 0) + 1
      };
    }
    return item;
  });
  saveNews(updated);
};
