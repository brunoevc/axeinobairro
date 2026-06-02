import { Merchant, merchants as baseMerchants } from "./merchants";

export type MerchantAdmin = Merchant & {
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  approvedBy?: string;
  notes?: string;
  whatsappClicks?: number;
  contactAttempts?: number;
  lastContactDate?: string;
  planChangedAt?: string;
  planChangedBy?: string;
  // Campos legados para compatibilidade UI
  emoji?: string;
};


export type AdminAction = {
  id: string;
  type: "approve" | "reject" | "plan_change" | "status_change" | "note_added" | "contact";
  merchantId: string;
  merchantName: string;
  adminName: string;
  timestamp: string;
  details: {
    oldValue?: string;
    newValue?: string;
    reason?: string;
  };
};

export type AdminStats = {
  totalMerchants: number;
  activeMerchants: number;
  pendingMerchants: number;
  rejectedMerchants: number;
  featuredMerchants: number;
  planDistribution: {
    free: number;
    assisted: number;
    local_featured: number;
    highlighted: number;
    premium_partner: number;
  };
  totalWhatsappClicks: number;
  totalContactAttempts: number;
  averageRating: number;
  merchantsByNeighborhood: Record<string, number>;
  planRevenue: {
    assisted: number;
    local_featured: number;
    highlighted: number;
    premium_partner: number;
  };
};

export type AdminState = {
  merchants: MerchantAdmin[];
  actions: AdminAction[];
  lastUpdated: string;
};

export function initializeMerchantAdmin(merchant: Merchant): MerchantAdmin {
  const isNew = Math.random() > 0.7;
  const status: Merchant["status"] = isNew ? "pending" : "verified";

  const whatsappClicks = Math.floor(Math.random() * 150);
  const contactAttempts = Math.floor(Math.random() * 50);

  return {
    ...merchant,
    status,
    emoji: "🏪", // Fallback para compatibilidade
    plan: merchant.plan || "free",
    approvedAt: status !== "pending" ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    approvedBy: status !== "pending" ? "Auto-Admin" : undefined,

    notes: "",
    whatsappClicks,
    contactAttempts,
    lastContactDate: contactAttempts > 0 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  };
}

export function calculateAdminStats(merchants: MerchantAdmin[]): AdminStats {
  const planDistribution = {
    free: 0,
    assisted: 0,
    local_featured: 0,
    highlighted: 0,
    premium_partner: 0,
  };

  const merchantsByNeighborhood: Record<string, number> = {};
  let totalWhatsappClicks = 0;
  let totalContactAttempts = 0;
  let totalRating = 0;
  let activeMerchants = 0;
  let pendingMerchants = 0;
  let rejectedMerchants = 0;
  let featuredMerchants = 0;

  merchants.forEach((m) => {
    const plan = m.plan || "free";
    planDistribution[plan]++;
    totalWhatsappClicks += m.whatsappClicks || 0;
    totalContactAttempts += m.contactAttempts || 0;
    totalRating += m.rating;

    if (m.status !== "pending" && m.status !== "rejected") activeMerchants++;
    if (m.status === "pending") pendingMerchants++;
    if (m.status === "rejected") rejectedMerchants++;
    if (m.featured && m.status !== "pending" && m.status !== "rejected") featuredMerchants++;


    const hood = m.neighborhood;
    merchantsByNeighborhood[hood] = (merchantsByNeighborhood[hood] || 0) + 1;
  });

  const planRevenue = {
    assisted: planDistribution.assisted * 27,
    local_featured: planDistribution.local_featured * 47,
    highlighted: planDistribution.highlighted * 97,
    premium_partner: planDistribution.premium_partner * 147,
  };

  return {
    totalMerchants: merchants.length,
    activeMerchants,
    pendingMerchants,
    rejectedMerchants,
    featuredMerchants,
    planDistribution,
    totalWhatsappClicks,
    totalContactAttempts,
    averageRating: merchants.length > 0 ? Math.round((totalRating / merchants.length) * 10) / 10 : 0,
    merchantsByNeighborhood,
    planRevenue,
  };
}

export function getInitialAdminState(): AdminState {
  const merchantsAdmin = baseMerchants.map(initializeMerchantAdmin);

  const initialActions: AdminAction[] = [
    {
      id: "act-1",
      type: "approve",
      merchantId: "1",
      merchantName: "Cantina da Nonna",
      adminName: "Auto-Admin",
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      details: { reason: "Cadastro completo e verificado" },
    },
  ];

  return {
    merchants: merchantsAdmin,
    actions: initialActions,
    lastUpdated: new Date().toISOString(),
  };
}