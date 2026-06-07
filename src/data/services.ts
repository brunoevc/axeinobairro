import { ServiceProvider } from "@/types/services";

export const initialServices: ServiceProvider[] = [
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `s-${i + 1}`,
    name: `Profissional ${i + 1}`,
    category: ["eletricista", "encanador", "diarista", "professor"][i % 4],
    phone: "5521999999999",
    neighborhood: ["Centro", "Parque Hotel", "Vila Capri"][i % 3],
    description: `Descrição profissional para o serviço ${i + 1}.`,
    isAvailable: true,
    rating: 4.5,
    verified: i % 2 === 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
];
