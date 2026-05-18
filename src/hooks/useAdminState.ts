import { useState, useEffect, useCallback } from "react";
import { MerchantAdmin, AdminAction, AdminState, AdminStats, calculateAdminStats, getInitialAdminState } from "@/data/admin";

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

  // Aprovar merchant
  const approveMerchant = useCallback(
    (merchantId: string) => {
      if (!state) return;

      const merchant = state.merchants.find((m) => m.id === merchantId);
      if (!merchant) return;

      const updatedMerchants = state.merchants.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              status: "active" as const,
              approvedAt: new Date().toISOString(),
              approvedBy: "Auto-Admin",
              featured: true,
            }
          : m
      );

      const action: AdminAction = {
        id: `act-${Date.now()}`,
        type: "approve",
        merchantId,
        merchantName: merchant.name,
        adminName: "Auto-Admin",
        timestamp: new Date().toISOString(),
        details: { reason: "Aprovado via dashboard" },
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

  // Rejeitar merchant
  const rejectMerchant = useCallback(
    (merchantId: string, reason: string) => {
      if (!state) return;

      const merchant = state.merchants.find((m) => m.id === merchantId);
      if (!merchant) return;

      const updatedMerchants = state.merchants.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              status: "rejected" as const,
              rejectedAt: new Date().toISOString(),
              rejectionReason: reason,
            }
          : m
      );

      const action: AdminAction = {
        id: `act-${Date.now()}`,
        type: "reject",
        merchantId,
        merchantName: merchant.name,
        adminName: "Auto-Admin",
        timestamp: new Date().toISOString(),
        details: { reason },
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
      if (!merchant || merchant.status === "rejected" || merchant.status === "pending") return;

      const newStatus = (merchant.status === "active" ? "inactive" : "active") as "active" | "inactive";
      const updatedMerchants = state.merchants.map((m) =>
        m.id === merchantId ? { ...m, status: newStatus } : m
      );

      const action: AdminAction = {
        id: `act-${Date.now()}`,
        type: "status_change",
        merchantId,
        merchantName: merchant.name,
        adminName: "Auto-Admin",
        timestamp: new Date().toISOString(),
        details: { oldValue: merchant.status, newValue: newStatus },
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

  // Simular clique WhatsApp
  const recordWhatsappClick = useCallback(
    (merchantId: string) => {
      if (!state) return;

      const merchant = state.merchants.find((m) => m.id === merchantId);
      if (!merchant) return;

      const updatedMerchants = state.merchants.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              whatsappClicks: (m.whatsappClicks || 0) + 1,
              contactAttempts: (m.contactAttempts || 0) + 1,
              lastContactDate: new Date().toISOString(),
            }
          : m
      );

      const action: AdminAction = {
        id: `act-${Date.now()}`,
        type: "contact",
        merchantId,
        merchantName: merchant.name,
        adminName: "System",
        timestamp: new Date().toISOString(),
        details: {},
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
    approveMerchant,
    rejectMerchant,
    toggleMerchantStatus,
    changePlan,
    addNote,
    recordWhatsappClick,
    editMerchant,
  };
}
