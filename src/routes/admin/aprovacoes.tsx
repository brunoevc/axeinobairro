import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminState } from "@/hooks/useAdminState";
import { ApprovalQueue } from "@/components/admin/ApprovalQueue";
import { MerchantEditForm } from "@/components/admin/MerchantEditForm";
import { MerchantAdmin } from "@/data/admin";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";

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
        <p className="text-muted-foreground font-bold animate-pulse">Carregando fila...</p>
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
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Fila de Aprovações</h1>
        <p className="text-muted-foreground font-medium text-sm">
          Revisão de novos cadastros e moderação de conteúdo.
        </p>
      </header>

      {viewMode === "edit" && selectedMerchant ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="rounded-2xl h-12 px-6 font-bold border-border/60 hover:bg-secondary/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a Fila
          </Button>
          <MerchantEditForm
            merchant={selectedMerchant}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Summary Banner */}
          <div className="rounded-[2.5rem] bg-amber-500/10 border border-amber-200/50 p-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                <Clock className="h-7 w-7 text-amber-600" />
              </div>
              <div>
                <p className="text-amber-800 font-black text-xl tracking-tight leading-tight">
                  {pendingCount} {pendingCount === 1 ? "cadastro" : "cadastros"}
                </p>
                <p className="text-amber-700/70 text-xs font-bold uppercase tracking-widest mt-1">Aguardando Moderação</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700/40">SLA: 24h</span>
            </div>
          </div>

          {/* Approval Queue Component */}
          <div className="grid grid-cols-1 gap-6">
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