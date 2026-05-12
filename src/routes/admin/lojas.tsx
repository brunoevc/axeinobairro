import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminState } from "@/hooks/useAdminState";
import { MerchantsTable } from "@/components/admin/MerchantsTable";
import { MerchantEditForm } from "@/components/admin/MerchantEditForm";
import { MerchantAdmin } from "@/data/admin";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/lojas")({
  component: AdminLojasPage,
  head: () => ({
    meta: [
      { title: "Lojas — Admin Axêi" },
      { name: "description", content: "Gestão de lojistas" },
    ],
  }),
});

type ViewMode = "list" | "edit";

function AdminLojasPage() {
  const navigate = useNavigate();
  const {
    state,
    loading,
    toggleMerchantStatus,
    changePlan,
    editMerchant,
  } = useAdminState();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantAdmin | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<
    MerchantAdmin["status"] | "all"
  >("all");

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
      setViewMode("list");
      setSelectedMerchant(null);
    }
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelectedMerchant(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Lojas</h1>
        <p className="text-muted-foreground">
          Gerenciar lojistas, planos e status de atividade
        </p>
      </div>

      {viewMode === "edit" && selectedMerchant ? (
        <>
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
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
          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === "all" ? "whatsapp" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              Todos ({state.merchants.length})
            </Button>
            <Button
              variant={statusFilter === "active" ? "whatsapp" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("active")}
            >
              ✅ Ativos ({state.merchants.filter((m) => m.status === "active").length})
            </Button>
            <Button
              variant={statusFilter === "pending" ? "whatsapp" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
            >
              ⏳ Pendentes ({state.merchants.filter((m) => m.status === "pending").length})
            </Button>
            <Button
              variant={statusFilter === "inactive" ? "whatsapp" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("inactive")}
            >
              ⭐ Inativos ({state.merchants.filter((m) => m.status === "inactive").length})
            </Button>
            <Button
              variant={statusFilter === "rejected" ? "whatsapp" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("rejected")}
            >
              ❌ Rejeitados ({state.merchants.filter((m) => m.status === "rejected").length})
            </Button>
          </div>

          {/* Tabela */}
          <MerchantsTable
            merchants={state.merchants}
            onEdit={handleEdit}
            onToggleStatus={toggleMerchantStatus}
            onChangePlan={changePlan}
            filterStatus={statusFilter}
          />
        </>
      )}
    </div>
  );
}
