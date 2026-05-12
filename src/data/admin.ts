import { Merchant, merchants as baseMerchants } from "./merchants";

// Extensão dos dados do Merchant com campos admin
export type MerchantAdmin = Merchant & {
  status: "pending" | "active" | "inactive" | "rejected";
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

// Função para converter Merchant para MerchantAdmin
export function initializeMerchantAdmin(merchant: Merchant): MerchantAdmin {
  // Simular alguns dados baseado no plan
  const isNew = merchant.isNew || Math.random() > 0.7;
  const status = isNew ? "pending" : "active";
  const whatsappClicks = Math.floor(Math.random() * 150);
  const contactAttempts = Math.floor(Math.random() * 50);

  return {
    ...merchant,
    status,
    approvedAt: status === "active" ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    approvedBy: status === "active" ? "Auto-Admin" : undefined,
    notes: "",
    whatsappClicks,
    contactAttempts,
    lastContactDate: contactAttempts > 0 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  };
}

// Função para calcular stats
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
    planDistribution[m.plan]++;
    totalWhatsappClicks += m.whatsappClicks || 0;
    totalContactAttempts += m.contactAttempts || 0;
    totalRating += m.rating;

    if (m.status === "active") activeMerchants++;
    if (m.status === "pending") pendingMerchants++;
    if (m.status === "rejected") rejectedMerchants++;
    if (m.featured && m.status === "active") featuredMerchants++;

    const hood = m.neighborhood;
    merchantsByNeighborhood[hood] = (merchantsByNeighborhood[hood] || 0) + 1;
  });

  // Calcular receita simulada (em R$)
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

// Função para obter merchanst inicial (com dados mockados)
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
    {
      id: "act-2",
      type: "plan_change",
      merchantId: "1",
      merchantName: "Cantina da Nonna",
      adminName: "Auto-Admin",
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      details: { oldValue: "highlighted", newValue: "premium_partner" },
    },
  ];

  return {
    merchants: merchantsAdmin,
    actions: initialActions,
    lastUpdated: new Date().toISOString(),
  };
}
