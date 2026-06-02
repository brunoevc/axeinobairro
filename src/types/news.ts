export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "eventos" | "promocoes" | "utilidade";
  date: string;
  imageUrl: string;
  merchantId: string;
  exposureLevel: "A" | "B" | "C";
  isActive: boolean;
  views: number;
  clicks: number;
};
