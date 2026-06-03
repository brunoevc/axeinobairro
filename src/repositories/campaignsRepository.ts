import { Campaign } from "@/types/campaigns";

const STORAGE_KEY = "axei_campaigns";

export const campaignsRepository = {
  getAll: (): Campaign[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  save: (campaign: Campaign) => {
    const campaigns = campaignsRepository.getAll();
    const index = campaigns.findIndex(c => c.id === campaign.id);
    if (index !== -1) {
      campaigns[index] = campaign;
    } else {
      campaigns.push(campaign);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  }
};
