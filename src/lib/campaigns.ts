import { Campaign } from "@/types/campaigns";
import { campaignsRepository } from "@/repositories/campaignsRepository";

export const getCampaigns = (): Campaign[] => {
  return campaignsRepository.getAll();
};

export const saveCampaign = (campaign: Campaign) => {
  campaignsRepository.save(campaign);
};


export const canCreateCampaign = (merchantId: string): { can: boolean; reason?: string } => {
  const campaigns = getCampaigns().filter(c => c.merchantId === merchantId);
  const now = new Date();
  
  // Rule: Max 1 per day
  const today = now.toISOString().split('T')[0];
  const campaignsToday = campaigns.filter(c => c.createdAt.startsWith(today));
  if (campaignsToday.length >= 1) {
    return { can: false, reason: "Limite de campanhas atingido para evitar spam. (Máximo 1 por dia)" };
  }
  
  // Rule: Max 3 per week
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const campaignsThisWeek = campaigns.filter(c => new Date(c.createdAt) > oneWeekAgo);
  if (campaignsThisWeek.length >= 3) {
    return { can: false, reason: "Limite de campanhas atingido para evitar spam. (Máximo 3 por semana)" };
  }
  
  return { can: true };
};

export const trackCampaignInteraction = (campaignId: string, type: 'click' | 'response' | 'conversion') => {
  const campaigns = getCampaigns();
  const campaign = campaigns.find(c => c.id === campaignId);
  
  if (campaign) {
    if (type === 'click') campaign.stats.clicks++;
    if (type === 'response') campaign.stats.responses++;
    if (type === 'conversion') campaign.stats.conversions++;
    saveCampaign(campaign);
  }
};
