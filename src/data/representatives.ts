import { Representative } from "@/types/representatives";

export const initialRepresentatives: Representative[] = [
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `rep-${i + 1}`,
    name: ["Ana Silva", "Carlos Oliveira", "Márcia Santos", "Paulo Souza", "Juliana Lima", "Ricardo Costa"][i],
    role: i % 2 === 0 ? "Líder Comunitário" : "Representante de Bairro",
    city: "Araruama",
    neighborhood: ["Centro", "Parque Hotel", "Vila Capri", "Rio do Limão", "Iguabinha", "Praia Seca"][i],
    phone: "22999999999",
    whatsapp: "5522999999999",
    description: `Atuante na valorização do comércio local e melhorias do bairro ${["Centro", "Parque Hotel", "Vila Capri", "Rio do Limão", "Iguabinha", "Praia Seca"][i]}.`,
    isActive: true,
    photo: `https://images.unsplash.com/photo-${1500000000000 + i * 5000}?w=400&h=400&fit=crop&q=80`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
];
