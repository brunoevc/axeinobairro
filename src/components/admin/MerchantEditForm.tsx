import { useState } from "react";
import { MerchantAdmin } from "@/data/admin";
import { Button } from "@/components/ui/button";

type MerchantEditFormProps = {
  merchant: MerchantAdmin;
  onSave: (updated: Partial<MerchantAdmin>) => void;
  onCancel: () => void;
};

export function MerchantEditForm({
  merchant,
  onSave,
  onCancel,
}: MerchantEditFormProps) {
  const [formData, setFormData] = useState({
    name: merchant.name,
    description: merchant.description,
    whatsapp: merchant.whatsapp,
    neighborhood: merchant.neighborhood,
    notes: merchant.notes || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-xl bg-card p-6 border border-accent/10 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <span>{merchant.emoji}</span> Editar {merchant.name}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nome da Loja
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg border border-accent/20 bg-background/50 px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full rounded-lg border border-accent/20 bg-background/50 px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 transition-colors resize-none"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              WhatsApp (sem +)
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) =>
                setFormData({ ...formData, whatsapp: e.target.value })
              }
              className="w-full rounded-lg border border-accent/20 bg-background/50 px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
              placeholder="5511999990001"
            />
          </div>

          {/* Bairro */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bairro
            </label>
            <input
              type="text"
              value={formData.neighborhood}
              onChange={(e) =>
                setFormData({ ...formData, neighborhood: e.target.value })
              }
              className="w-full rounded-lg border border-accent/20 bg-background/50 px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notas Internas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full rounded-lg border border-accent/20 bg-background/50 px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent/50 transition-colors resize-none"
              placeholder="Observações internas sobre esta loja..."
            />
          </div>

          {/* Informações adicionais */}
          <div className="bg-background/50 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-bold text-foreground">Informações</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Categoria</p>
                <p className="font-medium text-foreground">{merchant.category}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-medium text-foreground">
                  {merchant.status === "active"
                    ? "✅ Ativo"
                    : merchant.status === "pending"
                      ? "⏳ Pendente"
                      : merchant.status === "inactive"
                        ? "⭐ Inativo"
                        : "❌ Rejeitado"}
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
                <p className="text-xs text-muted-foreground">Cliques WhatsApp</p>
                <p className="font-medium text-foreground">
                  {merchant.whatsappClicks || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="whatsapp"
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? "..." : "💾 Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
