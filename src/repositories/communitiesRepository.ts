import { Community } from "@/types/communities";
import { storage } from "./storage";
import { initialCommunities } from "@/data/communities";

const STORAGE_KEY = "axei_communities";


export const communitiesRepository = {
  getAll: (): Community[] => storage.get(STORAGE_KEY, initialCommunities),
  getById: (id: string): Community | undefined => communitiesRepository.getAll().find(c => c.id === id),
  getByType: (type: string): Community[] => communitiesRepository.getAll().filter(c => c.type === type),
  getByNeighborhood: (neighborhood: string): Community[] => communitiesRepository.getAll().filter(c => c.neighborhood === neighborhood),
  save: (community: Community) => {
    const list = communitiesRepository.getAll();
    const index = list.findIndex(c => c.id === community.id);
    if (index !== -1) {
      list[index] = community;
    } else {
      list.push(community);
    }
    storage.set(STORAGE_KEY, list);
  },
  create: (community: Community) => {
    communitiesRepository.save(community);
  }
};

