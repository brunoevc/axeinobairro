export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "eventos" | "promocoes" | "utilidade" | "local";
  date: string;
  imageUrl: string;
  merchantId?: string; // Optional if it's local news not linked to a merchant
  exposureLevel: "A" | "B" | "C";
  isActive: boolean;
  views: number;
  clicks: number;
  origin?: string; // e.g., "Portal Araruama", "G1 Região dos Lagos"
  sourceUrl?: string; // RSS link
};
