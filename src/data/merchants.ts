import { Merchant } from "./merchants";

export const initialMerchants: Merchant[] = [
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `m-${i + 1}`,
    name: `Negócio Local ${i + 1}`,
    category: ["restaurante", "padaria", "pet", "farmacia"][i % 4],
    categoryIcon: "Store",
    neighborhood: ["Centro", "Parque Hotel", "Vila Capri"][i % 3],
    isOpen: true,
    delivery: true,
    rating: 4.0,
    description: `Descrição do negócio ${i + 1} para melhor visibilidade no portal.`,
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
    latitude: -22.87,
    longitude: -42.34,
    status: "verified",
    document: "12345678000100",
    createdAt: new Date().toISOString(),
  }))
];
