import { useState, useEffect, useCallback } from "react";
import { trackEvent } from "@/lib/metrics";
import { MerchantAdmin, AdminAction, AdminState, AdminStats, calculateAdminStats, initializeMerchantAdmin } from "@/data/admin";
import { Merchant } from "@/data/merchants";
import { merchantsRepository } from "@/repositories/merchantsRepository";

const ADMIN_STATE_KEY = "axei-admin-state";

export function useAdminState() {
  const [state, setState] = useState<AdminState | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializar estado do localStorage e sincronizar com o repositório
  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_STATE_KEY);
    const repoMerchants = merchantsRepository.getAll();
    
    let initialState: AdminState;

    if (stored) {
      try {
        initialState = JSON.parse(stored);
        
        // Sincronizar com repositório para garantir que dados recentes (Home/Cadastro) estejam aqui
        // Mas mantendo metadados administrativos se existirem
        const syncedMerchants = repoMerchants.map(rm => {
          const adminData = initialState.merchants.find(am => am.id === rm.id);
          return adminData ? { ...rm, ...adminData } : initializeMerchantAdmin(rm);
        });
        
        initialState.merchants = syncedMerchants;
      } catch {
        initialState = {
          merchants: repoMerchants.map(initializeMerchantAdmin),
          actions: [],
          lastUpdated: new Date().toISOString()
        };
      }
    } else {
      initialState = {
        merchants: repoMerchants.map(initializeMerchantAdmin),
        actions: [],
        lastUpdated: new Date().toISOString()
      };
    }

    setState(initialState);
    setStats(calculateAdminStats(initialState.merchants));
    setLoading(false);
  }, []);

  // Persistir estado e atualizar repositório como fonte de verdade
  const saveState = useCallback((newState: AdminState) => {
    localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(newState));
    setState(newState);
    setStats(calculateAdminStats(newState.merchants));
    
    // Sincronizar dados públicos para o repositório
    newState.merchants.forEach(m => {
      // Extrair apenas campos do Merchant para o repositório público
      const { 
        approvedAt, rejectedAt, rejectionReason, approvedBy, notes, 
        whatsappClicks, instagramClicks, routeClicks, shareClicks, 
        reportsCount, searchAppearances, views, productAdded, 
        pedidoWhatsapp, lastContactDate, planChangedAt, planChangedBy, 
        emoji, ...publicMerchant 
      } = m;
      
      merchantsRepository.save(publicMerchant as Merchant);
    });
  }, []);

  // Atualizar status do merchant
  const updateMerchantStatus = useCallback(
    (merchantId: string, newStatus: Merchant["status"], reason?: string) => {
      if (!state) return;

      const merchant = state.merchants.find((m) => m.id === merchantId);
      if (!merchant) return;

      const updatedMerchants = state.merchants.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              status: newStatus,
              approvedAt: (newStatus !== "pending" && newStatus !== "rejected") ? new Date().toISOString() : m.approvedAt,
              rejectedAt: newStatus === "rejected" ? new Date().toISOString() : m.rejectedAt,
              rejectionReason: newStatus === "rejected" ? reason : m.rejectionReason,
              featured: newStatus === "featured" || newStatus === "partner" ? true : m.featured,
              exposureLevel: newStatus === "featured" ? "A" : (newStatus === "partner" ? "B" : m.exposureLevel)
            }
          : m
      );

      const action: AdminAction = {
        id: `act-${Date.now()}`,
        type: newStatus === "rejected" ? "reject" : "status_change",
        merchantId,
        merchantName: merchant.name,
        adminName: "Auto-Admin",
        timestamp: new Date().toISOString(),
        details: { oldValue: merchant.status, newValue: newStatus, reason },
      };

      const newState: AdminState = {
        merchants: updatedMerchants,
        actions: [action, ...state.actions],
        lastUpdated: new Date().toISOString(),
      };

      saveState(newState);
    },
    [state, saveState]
  );

  // Ativar/Desativar merchant
  const toggleMerchantStatus = useCallback(
    (merchantId: string) => {
      if (!state) return;

      const merchant = state.merchants.find((m) => m.id === merchantId);
      if (!merchant) return;

      const newStatus: Merchant["status"] = (merchant.status === "pending" ? "verified" : "pending");
      updateMerchantStatus(merchantId, newStatus);
    },
    [state, updateMerchantStatus]
  );


  // Alterar plano
  const changePlan = useCallback(
    (merchantId: string, newPlan: MerchantAdmin["plan"]) => {
      if (!state) return;

      const merchant = state.merchants.find((m) => m.id === merchantId);
      if (!merchant) return;

      const updatedMerchants = state.merchants.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              plan: newPlan,
              planChangedAt: new Date().toISOString(),
              planChangedBy: "Auto-Admin",
              // Sincronizar nível de exposição com o plano se necessário
              exposureLevel: newPlan === "pro" ? "A" : (newPlan === "sales" ? "B" : m.exposureLevel)
            }
          : m
      );

      const action: AdminAction = {
        id: `act-${Date.now()}`,
        type: "plan_change",
        merchantId,
        merchantName: merchant.name,
        adminName: "Auto-Admin",
        timestamp: new Date().toISOString(),
        details: { oldValue: merchant.plan, newValue: newPlan },
      };

      const newState: AdminState = {
        merchants: updatedMerchants,
        actions: [action, ...state.actions],
        lastUpdated: new Date().toISOString(),
      };

      saveState(newState);
    },
    [state, saveState]
  );

  // Adicionar nota
  const addNote = useCallback(
    (merchantId: string, note: string) => {
      if (!state) return;

      const merchant = state.merchants.find((m) => m.id === merchantId);
      if (!merchant) return;

      const updatedMerchants = state.merchants.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              notes: note,
            }
          : m
      );

      const action: AdminAction = {
        id: `act-${Date.now()}`,
        type: "note_added",
        merchantId,
        merchantName: merchant.name,
        adminName: "Auto-Admin",
        timestamp: new Date().toISOString(),
        details: { reason: note },
      };

      const newState: AdminState = {
        merchants: updatedMerchants,
        actions: [action, ...state.actions],
        lastUpdated: new Date().toISOString(),
      };

      saveState(newState);
    },
    [state, saveState]
  );

  // Simular clique WhatsApp
  const recordWhatsappClick = useCallback(
    (merchantId: string) => {
      trackEvent(merchantId, "whatsapp");
    },
    []
  );

  // Editar merchant
  const editMerchant = useCallback(
    (merchantId: string, updates: Partial<MerchantAdmin>) => {
      if (!state) return;

      const merchant = state.merchants.find((m) => m.id === merchantId);
      if (!merchant) return;

      const updatedMerchants = state.merchants.map((m) =>
        m.id === merchantId ? { ...m, ...updates } : m
      );

      const action: AdminAction = {
        id: `act-${Date.now()}`,
        type: "status_change",
        merchantId,
        merchantName: merchant.name,
        adminName: "Auto-Admin",
        timestamp: new Date().toISOString(),
        details: { reason: "Dados do estabelecimento atualizados" },
      };

      const newState: AdminState = {
        merchants: updatedMerchants,
        actions: [action, ...state.actions],
        lastUpdated: new Date().toISOString(),
      };

      saveState(newState);
    },
    [state, saveState]
  );

  return {
    state,
    stats,
    loading,
    updateMerchantStatus,
    toggleMerchantStatus,
    changePlan,
    addNote,
    recordWhatsappClick,
    editMerchant,
  };
}


