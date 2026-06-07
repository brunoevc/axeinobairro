import { NewsItem } from "@/types/news";

export const initialNews: NewsItem[] = [
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `n-${i + 1}`,
    title: i % 4 === 0 ? `Evento: ${i + 1}º Festival de Verão` : `Notícia Local: Atualização ${i + 1}`,
    summary: `Resumo detalhado sobre o acontecimento ${i + 1} em Araruama. Acompanhe as principais novidades da nossa região.`,
    content: `Conteúdo completo da notícia ${i + 1} para leitura aprofundada. Este é um exemplo de texto informativo para o portal Axêi no Bairro.`,
    category: i % 4 === 0 ? "eventos" : (i % 4 === 1 ? "promocoes" : (i % 4 === 2 ? "local" : "utilidade")),
    date: new Date().toISOString(),
    imageUrl: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=800&q=80`,
    exposureLevel: (i % 3 === 0 ? "A" : (i % 3 === 1 ? "B" : "C")) as "A" | "B" | "C",
    isActive: true,
    views: 0,
    clicks: 0,
  }))
];
