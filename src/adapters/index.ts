import { Merchant } from "@/data/merchants";
import { MerchantRecord } from "@/types/database";

export const merchantToRecord = (merchant: Merchant): MerchantRecord => ({
  ...merchant,
  updatedAt: merchant.createdAt, // Fallback
  source: 'localStorage' as const,
});

export const recordToMerchant = (record: MerchantRecord): Merchant => {
  const { updatedAt, deletedAt, ownerId, source, ...merchant } = record;
  return merchant as Merchant;
};

// Add other adapters here as needed
import { NewsItem } from "@/types/news";
import { NewsRecord } from "@/types/database";

export const newsToRecord = (news: NewsItem): NewsRecord => ({
  ...news,
  createdAt: news.date, // Fallback
  updatedAt: news.date,
  source: 'localStorage' as const,
});

export const recordToNews = (record: NewsRecord): NewsItem => {
  const { updatedAt, deletedAt, ownerId, source, ...news } = record;
  return news as NewsItem;
};

import { Campaign } from "@/types/campaigns";
import { CampaignRecord } from "@/types/database";

export const campaignToRecord = (campaign: Campaign): CampaignRecord => ({
  ...campaign,
  updatedAt: campaign.createdAt,
  source: 'localStorage' as const,
});

export const recordToCampaign = (record: CampaignRecord): Campaign => {
  const { updatedAt, deletedAt, ownerId, source, ...campaign } = record;
  return campaign as Campaign;
};

import { Representative } from "@/types/representatives";
import { RepresentativeRecord } from "@/types/database";

export const representativeToRecord = (rep: Representative): RepresentativeRecord => ({
  ...rep,
  source: 'localStorage' as const,
});

export const recordToRepresentative = (record: RepresentativeRecord): Representative => {
  const { updatedAt, deletedAt, ownerId, source, ...rep } = record;
  return rep as Representative;
};
