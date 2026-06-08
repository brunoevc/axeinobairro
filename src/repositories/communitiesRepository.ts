import { Community } from "@/types/communities";
import { supabase } from "@/integrations/supabase/client";
import { initialCommunities } from "@/data/communities";

export const communitiesRepository = {
  getAll: async (): Promise<Community[]> => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('name');

      if (error) throw error;
      
      if (!data || data.length === 0) return initialCommunities;

      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        type: (item.category as any) || 'social',
        city: 'Araruama',
        neighborhood: item.neighborhood || undefined,
        description: item.description || '',
        isActive: true,
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
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
    const { error } = await supabase.from('communities').upsert({
      id: community.id,
      name: community.name,
      category: community.type,
      neighborhood: community.neighborhood,
      description: community.description,
      updated_at: new Date().toISOString()
    } as any);

    if (error) {
      console.error("Error saving community:", error);
      throw error;
    }
  }
};