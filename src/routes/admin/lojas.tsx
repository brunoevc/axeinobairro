import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import React, { useState } from "react";
import { 
  Eye, 
  Edit3, 
  Plus,
  Store,
  TrendingUp,
  MessageSquare,
  Instagram as InstagramIcon,
  Users,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Clock,
  Filter
} from "lucide-react";
import { useAdminState } from "@/hooks/useAdminState";
import { MerchantsTable } from "@/components/admin/MerchantsTable";
import { MerchantEditForm } from "@/components/admin/MerchantEditForm";
import { MerchantAdmin } from "@/data/admin";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/lojas")({
  component: AdminLojas,
});

function AdminLojas() {
  const { state, loading, updateMerchantStatus, changePlan, editMerchant } = useAdminState();
  const [activeTab, setActiveTab] = useState("todas");
  const [viewMode, setViewMode] = useState<"table" | "edit">("table");
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantAdmin | null>(null);

  if (loading || !state) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg text-slate-400 font-black animate-pulse uppercase tracking-widest">Carregando lojas...</p>
        </div>
      </div>
    );
  }

  const handleEdit = (merchant: MerchantAdmin) => {
    setSelectedMerchant(merchant);
    setViewMode("edit");
  };

  const handleSave = (updates: Partial<MerchantAdmin>) => {
    if (selectedMerchant) {
      editMerchant(selectedMerchant.id, updates);
      setViewMode("table");
      setSelectedMerchant(null);
    }
  };

  const tabs = [
    { id: "todas", label: "Todas" },
    { id: "pending", label: "Pendentes" },
    { id: "verified", label: "Verificadas" },
    { id: "featured", label: "Destaques" },
    { id: "partner", label: "Parceiros" },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">
            Minhas <span className="text-orange-600">Lojas</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-1">
            Gerencie seus anúncios, promoções e veja seu desempenho.
          </p>
        </div>
        <Button asChild className="rounded-2xl font-black gap-2 h-14 px-8 bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-200 transition-all active:scale-95">
          <Link to="/cadastro">
            <Plus className="h-5 w-5" />
            Cadastrar Nova Loja
          </Link>
        </Button>
      </header>

      {viewMode === "edit" && selectedMerchant ? (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-2 overflow-hidden">
          <MerchantEditForm
            merchant={selectedMerchant}
            onSave={handleSave}
            onCancel={() => setViewMode("table")}
          />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <MerchantsTable
              merchants={state.merchants}
              onEdit={handleEdit}
              onToggleStatus={(id) => {
                const m = state.merchants.find(m => m.id === id);
                if (m) {
                  const newStatus = m.status === "pending" ? "verified" : "pending";
                  updateMerchantStatus(id, newStatus);
                }
              }}
              onChangePlan={(id, status) => {
                const m = state.merchants.find(m => m.id === id);
                if (m) {
                   // In this context, onChangePlan is being used to update status
                   updateMerchantStatus(id, status);
                }
              }}
              filterStatus={activeTab === "todas" ? "all" : (activeTab as any)}
            />

          </div>
        </div>
      )}
    </div>
  );
}
