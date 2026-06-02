import { NewsItem } from "@/types/news";

export const initialNews: NewsItem[] = [
  {
    id: "1",
    title: "Festival de Massas Artesanais",
    summary: "Venha experimentar as novas receitas de família da Cantina da Nonna.",
    content: "Estamos lançando o novo cardápio de massas, venha conferir...",
    category: "eventos",
    date: new Date().toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    merchantId: "1",
    exposureLevel: "A",
    isActive: true,
    views: 0,
    clicks: 0,
  },
  {
    id: "2",
    title: "Liquidação de Verão",
    summary: "A Boutique Fashion preparou ofertas imperdíveis.",
    content: "Toda a loja com até 50% de desconto.",
    category: "promocoes",
    date: new Date().toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1441984908747-d41fd18e39ed?w=800&q=80",
    merchantId: "8",
    exposureLevel: "B",
    isActive: true,
    views: 0,
    clicks: 0,
  }
];
