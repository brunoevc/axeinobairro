import { useState, useEffect, useCallback } from "react";
import { MerchantAdmin, AdminAction, AdminState, AdminStats, calculateAdminStats, getInitialAdminState } from "@/data/admin";
import { Merchant } from "@/data/merchants";


const ADMIN_STATE_KEY = "axei-admin-state";

export function useAdminState() {
  const [state, setState] = useState<AdminState | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializar estado do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_STATE_KEY);
    let initialState: AdminState;

    if (stored) {
      try {
        initialState = JSON.parse(stored);
      } catch {
        initialState = getInitialAdminState();
      }
    } else {
      initialState = getInitialAdminState();
    }

    setState(initialState);
    setStats(calculateAdminStats(initialState.merchants));
    setLoading(false);
  }, []);

  // Persistir estado
  const saveState = useCallback((newState: AdminState) => {
    localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(newState));
    setState(newState);
    setStats(calculateAdminStats(newState.merchants));
  }, []);

  // Atualizar status do merchant (approve/verify/highlight/partner/reject)
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

  // Ativar/Desativar merchant (Toggle entre pending e verified como exemplo simplificado)
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

  // Simular clique WhatsApp (legacy support for component calls)
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

      const updatedMerchants = state.merchants.map((m) =>
        m.id === merchantId ? { ...m, ...updates } : m
      );

      const newState: AdminState = {
        merchants: updatedMerchants,
        actions: state.actions,
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

