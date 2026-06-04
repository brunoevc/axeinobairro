import { Community } from "@/types/communities";
import { storage } from "./storage";

const STORAGE_KEY = "axei_communities";

const defaultCommunities: Community[] = [
  {
    id: "comm-1",
    name: "Igreja Matriz de Araruama",
    type: "religiosa",
    city: "Araruama",
    neighborhood: "Centro",
    description: "Comunidade paroquial central",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "comm-2",
    name: "Associação de Moradores da Vila Nova",
    type: "social",
    city: "Araruama",
    neighborhood: "Vila Nova",
    description: "Unindo moradores pelo bairro",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const communitiesRepository = {
  getAll: (): Community[] => storage.get(STORAGE_KEY, defaultCommunities),
  getById: (id: string): Community | undefined => communitiesRepository.getAll().find(c => c.id === id),
  getByType: (type: string): Community[] => communitiesRepository.getAll().filter(c => c.type === type),
  getByNeighborhood: (neighborhood: string): Community[] => communitiesRepository.getAll().filter(c => c.neighborhood === neighborhood),
  create: (community: Community) => {
    const list = communitiesRepository.getAll();
    list.push(community);
    storage.set(STORAGE_KEY, list);
  }
};
