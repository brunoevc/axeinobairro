import { NewsItem } from "@/types/news";

export const initialNews: NewsItem[] = [
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `n-${i + 1}`,
    title: `Notícia ou Evento Local ${i + 1}`,
    summary: `Resumo detalhado sobre o acontecimento ${i + 1} em Araruama.`,
    content: `Conteúdo completo da notícia ${i + 1} para leitura aprofundada.`,
    category: i % 3 === 0 ? "eventos" : i % 3 === 1 ? "promocoes" : "local",
    date: new Date().toISOString(),
    imageUrl: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=800&q=80`,
    isActive: true,
    views: 0,
    clicks: 0,
  }))
];
