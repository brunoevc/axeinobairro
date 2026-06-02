import { Merchant, merchants as baseMerchants } from "./merchants";

export type MerchantAdmin = Merchant & {
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  approvedBy?: string;
  notes?: string;
  whatsappClicks?: number;
  instagramClicks?: number;
  routeClicks?: number;
  shareClicks?: number;
  reportsCount?: number;
  searchAppearances?: number;
  views?: number;
  productAdded?: number;
  pedidoWhatsapp?: number;
  lastContactDate?: string;
  planChangedAt?: string;
  planChangedBy?: string;
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
    essential: number;
    sales: number;
    pro: number;
  };
  totalWhatsappClicks: number;
  totalContactAttempts: number;
  averageRating: number;
  merchantsByNeighborhood: Record<string, number>;
  planRevenue: {
    essential: number;
    sales: number;
    pro: number;
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
  const views = Math.floor(whatsappClicks * (2 + Math.random() * 3));
  const instagramClicks = Math.floor(Math.random() * 80);
  const routeClicks = Math.floor(Math.random() * 40);
  const shareClicks = Math.floor(Math.random() * 20);
  const searchAppearances = Math.floor(views * (1.5 + Math.random()));

  return {
    ...merchant,
    status,
    emoji: "🏪", // Fallback para compatibilidade
    plan: merchant.plan || "free",
    approvedAt: status !== "pending" ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    approvedBy: status !== "pending" ? "Auto-Admin" : undefined,

    notes: "",
    whatsappClicks,
    views,
    instagramClicks,
    routeClicks,
    shareClicks,
    searchAppearances,
    reportsCount: Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0,
    planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    planStatus: "active",
    lastContactDate: whatsappClicks > 0 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  };
}

export function calculateAdminStats(merchants: MerchantAdmin[]): AdminStats {
  const planDistribution = {
    free: 0,
    essential: 0,
    sales: 0,
    pro: 0,
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
    // Removed contactAttempts loop logic as it's no longer in the schema
    totalRating += m.rating;

    if (m.status !== "pending" && m.status !== "rejected") activeMerchants++;
    if (m.status === "pending") pendingMerchants++;
    if (m.status === "rejected") rejectedMerchants++;
    if (m.featured && m.status !== "pending" && m.status !== "rejected") featuredMerchants++;


    const hood = m.neighborhood;
    merchantsByNeighborhood[hood] = (merchantsByNeighborhood[hood] || 0) + 1;
  });

  const planRevenue = {
    essential: planDistribution.essential * 29,
    sales: planDistribution.sales * 79,
    pro: planDistribution.pro * 149,
  };

  return {
    totalMerchants: merchants.length,
    activeMerchants,
    pendingMerchants,
    rejectedMerchants,
    featuredMerchants,
    planDistribution,
    totalWhatsappClicks,
    totalContactAttempts: totalWhatsappClicks, // Simplified mapping to avoid missing field errors
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