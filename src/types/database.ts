import { PixConfig } from "./users";

/**
 * Database Record Types
 * Prepared for future Supabase migration
 */

export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  ownerId?: string;
  source: 'mock' | 'localStorage' | 'supabase';
}

export interface MerchantRecord extends BaseRecord {
  name: string;
  category: string;
  categoryIcon: string;
  neighborhood: string;
  isOpen: boolean;
  delivery: boolean;
  rating: number;
  description: string;
  whatsapp: string;
  address: string;
  hours: string;
  instagram: string;
  image: string;
  promotion: {
    title: string;
    description: string;
    isActive: boolean;
  };
  plan?: string;
  planStatus?: string;
  planExpiry?: string;
  featured?: boolean;
  isSponsored?: boolean;
  latitude: number;
  longitude: number;
  status: string;
  exposureLevel?: string;
  document: string;
  facebook?: string;
  responsibleName?: string;
  slug?: string;
  customDomain?: string;
  canonicalUrl?: string;
  pixConfig?: PixConfig;
}


export interface NewsRecord extends BaseRecord {
  title: string;
  summary: string;
  content: string;
  category: string;
  date: string;
  imageUrl: string;
  merchantId?: string;
  exposureLevel: string;
  isActive: boolean;
  views: number;
  clicks: number;
  origin?: string;
  sourceUrl?: string;
}

export interface RepresentativeRecord extends BaseRecord {
  name: string;
  role: string;
  city: string;
  neighborhood?: string;
  phone: string;
  whatsapp: string;
  photo?: string;
  description: string;
  isActive: boolean;
}

export interface CampaignRecord extends BaseRecord {
  merchantId: string;
  merchantName: string;
  title: string;
  message: string;
  target: string;
  targetValue?: string;
  channel: string;
  startDate: string;
  endDate: string;
  status: string;
  stats: {
    impacted: number;
    clicks: number;
    responses: number;
    conversions: number;
  };
}

export interface AppointmentRecord extends BaseRecord {
  merchantId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  googleEventId?: string;
}

export interface PaymentRecord extends BaseRecord {
  merchantId: string;
  merchantName: string;
  amount: number;
  customerName: string;
  description?: string;
  status: string;
  pixKey: string;
  expiresAt: string;
  receiptSentAt?: string;
  purposeName?: string;
  receiptFilename?: string;
  linkId?: string;
}

export interface PixLinkRecord extends BaseRecord {
  merchantId: string;
  merchantName: string;
  title: string;
  active: boolean;
  purposes: any[];
}
