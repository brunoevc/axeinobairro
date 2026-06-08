import { Community } from "@/types/communities";
import { supabase } from "@/integrations/supabase/client";
import { storage } from "./storage";
import { initialCommunities } from "@/data/communities";

const STORAGE_KEY = "axei_communities";


export const communitiesRepository = {
  getAll: async (): Promise<Community[]> => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('name');

      if (error) throw error;
      
      if (!data || data.length === 0) return initialCommunities;

      return data.map(item => ({
        id: item.id,
        name: item.name,
        type: (item.category as any) || 'social',
        city: 'Araruama', // Default for now
        neighborhood: item.neighborhood,
        description: item.description || '',
        isActive: true,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error("Error fetching communities:", error);
      return initialCommunities;
    }
  },
  getById: async (id: string): Promise<Community | undefined> => {
    const all = await communitiesRepository.getAll();
    return all.find(c => c.id === id);
  },
  getByType: async (type: string): Promise<Community[]> => {
    const all = await communitiesRepository.getAll();
    return all.filter(c => c.type === type);
  },
  getByNeighborhood: async (neighborhood: string): Promise<Community[]> => {
    const all = await communitiesRepository.getAll();
    return all.filter(c => c.neighborhood === neighborhood);
  },
  save: async (community: Community) => {
    await supabase.from('communities').upsert({
      id: community.id,
      name: community.name,
      category: community.type,
      neighborhood: community.neighborhood,
      description: community.description,
    });
  }
};

