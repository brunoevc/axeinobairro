import { 
  UtensilsCrossed, 
  ShoppingBasket, 
  Croissant, 
  Pill, 
  Scissors, 
  Wrench, 
  PawPrint, 
  Shirt, 
  Stethoscope,
  Fish,
  Leaf
} from "lucide-react";
import { getMerchantPublicPath } from "@/lib/slugs";
import { PixConfig } from "@/types/users";

export { getMerchantPublicPath };

export type Merchant = {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  neighborhood: string;
  isOpen: boolean;
  delivery: boolean;
  rating: number;
  description: string;
  whatsapp: string;
  address: string;
  hours: string;
  instagram: string;
  image: string;
  promotion: {
    title: string;
    description: string;
    isActive: boolean;
  };
  plan?: "free" | "essential" | "sales" | "pro";
  planStatus?: "active" | "expired" | "pending";
  planExpiry?: string;
  featured?: boolean;
  isSponsored?: boolean;
  latitude: number;
  longitude: number;
  views?: number;
  whatsappClicks?: number;
  instagramClicks?: number;
  routeClicks?: number;
  shareClicks?: number;
  reportsCount?: number;
  searchAppearances?: number;
  status: "pending" | "verified" | "featured" | "partner" | "rejected";
  exposureLevel?: "A" | "B" | "C" | "none";
  document: string;
  facebook?: string;
  responsibleName?: string;
  createdAt: string;
  slug?: string;
  customDomain?: string;
  canonicalUrl?: string;
  pixConfig?: PixConfig;
};

export const categories = [
  { slug: "padaria", label: "Padaria", icon: Croissant },
  { slug: "restaurante", label: "Restaurante", icon: UtensilsCrossed },
  { slug: "mercado", label: "Mercado", icon: ShoppingBasket },
  { slug: "farmacia", label: "Farmácia", icon: Pill },
  { slug: "beleza", label: "Beleza", icon: Scissors },
  { slug: "servicos", label: "Serviços", icon: Wrench },
  { slug: "pet", label: "Pet Shop", icon: PawPrint },
  { slug: "roupas", label: "Roupas", icon: Shirt },
  { slug: "saude", label: "Saúde", icon: Stethoscope },
  { slug: "peixaria", label: "Peixaria", icon: Fish },
  { slug: "hortifruti", label: "Hortifruti", icon: Leaf },
] as const;

export const neighborhoods = [
  "Centro",
  "Parque Hotel",
  "Rio do Limão",
  "Bananeiras",
  "Praia Seca",
  "Iguabinha",
  "Fazendinha",
  "Vila Capri",
  "Mutirão",
  "XV de Novembro"
];

export const initialMerchants: Merchant[] = [
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `m-${i + 1}`,
    name: `Negócio Local ${i + 1}`,
    category: ["restaurante", "padaria", "pet", "farmacia"][i % 4],
    categoryIcon: "Store",
    neighborhood: neighborhoods[i % neighborhoods.length],
    isOpen: true,
    delivery: true,
    rating: 4.0,
    description: `Descrição do negócio ${i + 1} para melhor visibilidade no portal. Localizado em ${neighborhoods[i % neighborhoods.length]}.`,
    whatsapp: "5521999999999",
    address: "Rua Exemplo, 123",
    hours: "08:00 - 18:00",
    instagram: "@axeinobairro",
    image: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=800&q=80`,
    promotion: {
      title: "Oferta Especial",
      description: "Desconto exclusivo para usuários Axêi.",
      isActive: i % 5 === 0,
    },
    featured: i % 10 === 0,
    exposureLevel: (i % 3 === 0 ? "A" : (i % 3 === 1 ? "B" : "C")) as "A" | "B" | "C",
    latitude: -22.87,
    longitude: -42.34,
    status: "verified" as const,
    document: "12345678000100",
    createdAt: new Date().toISOString(),
    slug: `negocio-local-${i + 1}`,
  }))
];

export const merchants = initialMerchants;
