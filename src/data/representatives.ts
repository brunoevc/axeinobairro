import { Representative } from "@/types/representatives";

export const initialRepresentatives: Representative[] = [
  {
    id: "1",
    name: "Ana Silva",
    role: "Líder Comunitária",
    city: "Araruama",
    neighborhood: "Centro",
    phone: "22999999999",
    whatsapp: "5522999999999",
    description: "Atuante na valorização do comércio local e melhorias do centro.",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];