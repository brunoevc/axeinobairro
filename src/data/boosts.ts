import { LocalBoost } from "@/types/boosts";

// Helper to create dates relative to now
const now = new Date();
const nextMonth = new Date(now);
nextMonth.setMonth(now.getMonth() + 1);
const lastMonth = new Date(now);
lastMonth.setMonth(now.getMonth() - 1);

export const mockBoosts: LocalBoost[] = [
  {
    id: "boost-1",
    targetId: "1", // Loja: Cantina da Nonna (assuming mock ID)
    targetType: "loja",
    level: "A",
    startDate: now.toISOString(),
    endDate: nextMonth.toISOString(),
    isActive: true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: "boost-2",
    targetId: "1", // Serviço: João Eletricista (assuming mock ID)
    targetType: "servico",
    level: "A",
    startDate: now.toISOString(),
    endDate: nextMonth.toISOString(),
    isActive: true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: "boost-3",
    targetId: "1", // Transporte: João Silva (assuming mock ID)
    targetType: "transporte",
    level: "B",
    startDate: now.toISOString(),
    endDate: nextMonth.toISOString(),
    isActive: true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: "boost-4",
    targetId: "2", // Transporte: Maria Oliveira
    targetType: "transporte",
    level: "A",
    startDate: now.toISOString(),
    endDate: nextMonth.toISOString(),
    isActive: true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  },
  {
    id: "boost-expired",
    targetId: "2",
    targetType: "loja",
    level: "A",
    startDate: lastMonth.toISOString(),
    endDate: lastMonth.toISOString(),
    isActive: true,
    createdAt: lastMonth.toISOString(),
    updatedAt: lastMonth.toISOString()
  }
];
