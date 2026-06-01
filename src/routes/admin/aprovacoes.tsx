import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminState } from "@/hooks/useAdminState";
import { ApprovalQueue } from "@/components/admin/ApprovalQueue";
import { MerchantEditForm } from "@/components/admin/MerchantEditForm";
import { MerchantAdmin } from "@/data/admin";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, ShieldCheck, Filter, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/admin/aprovacoes")({
  component: AdminApprovals,
  head: () => ({
    meta: [
      { title: "Aprovações — Admin Axêi" },
      { name: "description", content: "Fila de aprovação de lojas" },
    ],
  }),
});

type ViewMode = "queue" | "edit";

function AdminApprovals() {
  const { state, loading, approveMerchant, rejectMerchant, editMerchant } =
    useAdminState();

  const [viewMode, setViewMode] = useState<ViewMode>("queue");
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantAdmin | null>(
    null
  );

  if (loading || !state) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg text-slate-400 font-black animate-pulse uppercase tracking-widest">Carregando fila...</p>
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
      setViewMode("queue");
      setSelectedMerchant(null);
    }
  };

  const handleCancel = () => {
    setViewMode("queue");
    setSelectedMerchant(null);
  };

  const pendingCount = state.merchants.filter((m) => m.status === "pending").length;

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">
            Fila de <span className="text-violet-600">Aprovações</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Revisão de novos cadastros e moderação de conteúdo.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl h-12 border-slate-200 font-bold bg-white">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
           </Button>
        </div>
      </header>

      {viewMode === "edit" && selectedMerchant ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="rounded-2xl h-14 px-8 font-black border-slate-200 hover:bg-white text-slate-600 group shadow-sm active:scale-95 transition-all"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar para a Fila
          </Button>
          
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-2 overflow-hidden">
             <MerchantEditForm
               merchant={selectedMerchant}
               onSave={handleSave}
               onCancel={handleCancel}
             />
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in duration-700">
          {/* Summary Banner */}
          <div className="rounded-[3.5rem] bg-amber-50 border border-amber-100 p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm group">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-amber-200 group-hover:scale-105 transition-transform duration-500">
                <Clock className="h-10 w-10 stroke-[2.5px]" />
              </div>
              <div>
                <p className="text-amber-900 font-black text-4xl tracking-tighter leading-none mb-2">
                  {pendingCount} {pendingCount === 1 ? "cadastro" : "cadastros"}
                </p>
                <p className="text-amber-700 font-black text-xs uppercase tracking-[0.2em] opacity-60">Aguardando Moderação Humana</p>
              </div>
            </div>
            
            <div className="flex flex-col md:items-end gap-3 border-t md:border-t-0 md:border-l border-amber-200/50 pt-8 md:pt-0 md:pl-8">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Verificação Ativa</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700/40">SLA Médio: 12 Horas</span>
            </div>
          </div>

          {/* Approval Queue Component */}
          <div className="grid grid-cols-1 gap-8">
            <ApprovalQueue
              merchants={state.merchants}
              onApprove={approveMerchant}
              onReject={rejectMerchant}
              onEdit={handleEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
}
