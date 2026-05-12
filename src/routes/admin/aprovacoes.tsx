import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminState } from "@/hooks/useAdminState";
import { ApprovalQueue } from "@/components/admin/ApprovalQueue";
import { MerchantEditForm } from "@/components/admin/MerchantEditForm";
import { MerchantAdmin } from "@/data/admin";
import { Button } from "@/components/ui/button";

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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando...</p>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Fila de Aprovações
        </h1>
        <p className="text-muted-foreground">
          Revisar e publicar novas lojas no marketplace
        </p>
      </div>

      {viewMode === "edit" && selectedMerchant ? (
        <>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            ← Voltar
          </Button>
          <MerchantEditForm
            merchant={selectedMerchant}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </>
      ) : (
        <>
          {/* Pending Count */}
          <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-200/50 p-6">
            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
              ⏳ {state.merchants.filter((m) => m.status === "pending").length}{" "}
              {state.merchants.filter((m) => m.status === "pending").length ===
              1
                ? "loja"
                : "lojas"}{" "}
              aguardando aprovação
            </p>
          </div>

          {/* Approval Queue */}
          <ApprovalQueue
            merchants={state.merchants}
            onApprove={approveMerchant}
            onReject={rejectMerchant}
            onEdit={handleEdit}
          />
        </>
      )}
    </div>
  );
}
