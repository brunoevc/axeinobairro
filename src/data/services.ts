import { ServiceProvider, ServiceCategory } from "@/types/services";

const categories: ServiceCategory[] = ["eletricista", "encanador", "diarista", "professor particular", "montador de móveis", "técnico de informática"];

export const initialServices: ServiceProvider[] = [
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `s-${i + 1}`,
    name: ["João", "Maria", "Carlos", "Ana", "Pedro", "Roberto"][i % 6] + ` ${["Silva", "Santos", "Oliveira", "Souza"][i % 4]}`,
    category: categories[i % categories.length],
    phone: "5521999999999",
    neighborhood: ["Centro", "Parque Hotel", "Vila Capri", "Rio do Limão", "Iguabinha"][i % 5],
    description: `Descrição profissional para o serviço ${i + 1}. Especialista com anos de experiência no mercado local.`,
    isAvailable: i % 5 !== 0,
    rating: 4.0 + (i % 10) / 10,
    verified: i % 2 === 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
];
