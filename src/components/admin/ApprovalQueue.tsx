import { useState } from "react";
import { MerchantAdmin } from "@/data/admin";
import { Button } from "@/components/ui/button";
import { AdminModal } from "./AdminModal";

type ApprovalQueueProps = {
  merchants: MerchantAdmin[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onEdit: (merchant: MerchantAdmin) => void;
};

export function ApprovalQueue({
  merchants,
  onApprove,
  onReject,
  onEdit,
}: ApprovalQueueProps) {
  const pending = merchants.filter((m) => m.status === "pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  if (pending.length === 0) {
    return (
      <div className="rounded-xl bg-card p-12 border border-accent/10 text-center">
        <p className="text-3xl mb-3">✅</p>
        <h3 className="text-lg font-bold text-foreground mb-2">Tudo em Dia!</h3>
        <p className="text-sm text-muted-foreground">
          Não há lojas pendentes de aprovação
        </p>
      </div>
    );
  }

  const selectedMerchant = pending.find((m) => m.id === selectedId);

  const handleConfirmApprove = () => {
    if (selectedId) {
      onApprove(selectedId);
      setSelectedId(null);
      setActionType(null);
    }
  };

  const handleConfirmReject = () => {
    if (selectedId) {
      onReject(selectedId, rejectReason || "Sem justificativa");
      setSelectedId(null);
      setRejectReason("");
      setActionType(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {pending.map((merchant) => (
          <div
            key={merchant.id}
            className="rounded-xl bg-card p-6 border border-amber-200/50 shadow-sm hover:border-amber-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏪</span>
                  <h4 className="font-bold text-lg text-foreground">
                    {merchant.name}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {merchant.category} • {merchant.neighborhood}
                </p>
                <p className="text-sm text-foreground">{merchant.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Cadastrado em</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date().toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4 mb-4">
              <h5 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Informações do Cadastro
              </h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">WhatsApp</p>
                  <p className="font-medium text-foreground">
                    {merchant.whatsapp}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Plano</p>
                  <p className="font-medium text-foreground">
                    {merchant.plan === "free"
                      ? "Grátis"
                      : merchant.plan === "assisted"
                        ? "R$27"
                        : merchant.plan === "local_featured"
                          ? "R$47"
                          : merchant.plan === "highlighted"
                            ? "R$97"
                            : "R$147"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Delivery</p>
                  <p className="font-medium text-foreground">
                    {merchant.delivery ? "Sim" : "Não"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Aberto Agora</p>
                  <p className="font-medium text-foreground">
                    {merchant.isOpen ? "Sim" : "Não"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="whatsapp"
                onClick={() => {
                  setSelectedId(merchant.id);
                  setActionType("approve");
                }}
                className="flex-1 sm:flex-none"
              >
                ✅ Aprovar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedId(merchant.id);
                  setActionType("reject");
                }}
                className="flex-1 sm:flex-none"
              >
                ❌ Rejeitar
              </Button>
              <Button
                variant="outline"
                onClick={() => onEdit(merchant)}
                className="flex-1 sm:flex-none"
              >
                ✏️ Editar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modais */}
      {actionType === "approve" && selectedMerchant && (
        <AdminModal
          title="Aprovar Loja"
          message={`Deseja aprovar ${selectedMerchant.name} para publicação?`}
          onConfirm={handleConfirmApprove}
          onCancel={() => {
            setActionType(null);
            setSelectedId(null);
          }}
          confirmText="Aprovar"
        />
      )}

      {actionType === "reject" && selectedMerchant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground mb-2">
              Rejeitar Loja
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedMerchant.name}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Motivo da Rejeição
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explique o motivo..."
                className="w-full rounded-lg border border-accent/20 bg-background/50 p-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setActionType(null);
                  setSelectedId(null);
                  setRejectReason("");
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="whatsapp"
                onClick={handleConfirmReject}
                className="flex-1"
              >
                Rejeitar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}