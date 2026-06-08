import { NewsItem } from "@/types/news";
import { initialNews } from "@/data/news";

const STORAGE_KEY = "axei_news_data";

export const newsRepository = {
  getAll: async (): Promise<NewsItem[]> => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) return initialNews;

      return data.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.excerpt || '',
        content: item.content,
        category: (item.category as any) || 'local',
        date: item.published_at || item.created_at,
        imageUrl: item.image_url || '',
        exposureLevel: item.is_featured ? 'A' : 'C',
        isActive: true,
        views: 0,
        clicks: 0,
      }));
    } catch (error) {
      console.error("Error fetching news:", error);
      return initialNews;
    }
  },

  updateInteraction: async (id: string, type: "views" | "clicks") => {
    // For Phase 12.0A, we'll log this to metrics_events
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('metrics_events').insert({
      user_id: user?.id,
      event_type: type === 'views' ? 'view' : 'click',
      entity_type: 'news',
      entity_id: id,
    });
  }
};
