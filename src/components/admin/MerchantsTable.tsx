import { useState } from "react";
import { ChevronDown, MessageSquare } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { MerchantAdmin } from "@/data/admin";
import { Merchant } from "@/data/merchants";
import { Button } from "@/components/ui/button";


const planLabels: Record<string, string> = {
  free: "Grátis",
  essential: "R$29",
  sales: "R$79",
  pro: "R$149",
};

const planColors: Record<string, string> = {
  free: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  essential: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  sales: "bg-accent/20 text-accent dark:bg-accent/30",
  pro: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
};

const statusLabels: Record<Merchant["status"], string> = {
  pending: "⏳ Pendente",
  verified: "✅ Verificado",
  featured: "✨ Destaque",
  partner: "🤝 Parceiro",
  rejected: "❌ Rejeitado",
};


type MerchantRowProps = {
  merchant: MerchantAdmin;
  onEdit: (merchant: MerchantAdmin) => void;
  onToggleStatus: (id: string) => void;
  onChangeStatus: (id: string, status: Merchant["status"]) => void;
  onChangePlan: (id: string, plan: MerchantAdmin["plan"]) => void;
  onManageCatalog?: (merchantId: string) => void;
};


export function MerchantRow({
  merchant,
  onEdit,
  onToggleStatus,
  onChangeStatus,
  onChangePlan,
  onManageCatalog,
}: MerchantRowProps) {

  const [statusOpen, setStatusOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const currentPlan = merchant.plan || "free";
  
  const plans: NonNullable<MerchantAdmin["plan"]>[] = [
    "free",
    "essential",
    "sales",
    "pro",
  ];


  return (
    <div className="border border-accent/10 rounded-lg p-4 mb-3 bg-card hover:border-accent/20 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{merchant.emoji || "🏪"}</span>
            <h4 className="font-bold text-foreground">{merchant.name}</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            {merchant.category} • {merchant.neighborhood}
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>{merchant.views || 0} views</p>
          <p>{merchant.whatsappClicks || 0} wpp</p>
          {merchant.pedidoWhatsapp && merchant.pedidoWhatsapp > 0 ? (
            <p className="text-emerald-600 font-bold">🛒 {merchant.pedidoWhatsapp} pedidos</p>
          ) : null}
          <p>⭐ {merchant.rating}</p>
        </div>

      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            merchant.status === "verified" || merchant.status === "featured" || merchant.status === "partner"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
              : merchant.status === "pending"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300"
          }`}

        >
          {statusLabels[merchant.status]}
        </span>
        <span className={`inline-block px-2 py-1 rounded text-xs font-black uppercase tracking-widest ${planColors[currentPlan]}`}>
          {planLabels[currentPlan]}
        </span>
        {merchant.reportsCount && merchant.reportsCount > 0 ? (
          <span className="inline-block px-2 py-1 rounded text-[10px] font-black uppercase bg-red-100 text-red-600 border border-red-200">
            ⚠️ {merchant.reportsCount} Denúncias
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(merchant)}
          className="text-xs"
        >
          ✏️ Editar
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="text-xs"
        >
          <Link to="/admin/leads" search={{ merchantId: merchant.id }}>
            👥 Leads
          </Link>
        </Button>


        <Button
          variant="outline"
          size="sm"
          onClick={() => onManageCatalog?.(merchant.id)}
          className="text-xs bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-600 hover:text-white transition-all"
        >
          🍔 Catálogo
        </Button>


        {merchant.status !== "rejected" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(merchant.id)}
            className="text-xs"
          >
            {merchant.status === "pending" ? "✅ Verificar" : "⏳ Pendente"}
          </Button>
        )}


        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusOpen(!statusOpen)}
            className="text-xs flex items-center gap-1"
          >
            ⚖️ Status
            <ChevronDown className="h-3 w-3" />
          </Button>

          {statusOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border border-accent/20 rounded-lg shadow-lg z-10 min-w-[150px]">
              {(["pending", "verified", "featured", "partner", "rejected"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onChangeStatus(merchant.id, status);
                    setStatusOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-accent/10 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                    merchant.status === status ? "bg-accent/20" : ""
                  }`}
                >
                  {statusLabels[status]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPlanOpen(!planOpen)}
            className="text-xs flex items-center gap-1"
          >
            📊 Plano
            <ChevronDown className="h-3 w-3" />
          </Button>

          {planOpen && (
            <div className="absolute top-full left-0 mt-1 bg-card border border-accent/20 rounded-lg shadow-lg z-10 min-w-[150px]">
              {plans.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    onChangePlan(merchant.id, p);
                    setPlanOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-accent/10 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                    currentPlan === p ? "bg-accent/20" : ""
                  }`}
                >
                  {planLabels[p]}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


type MerchantsTableProps = {
  merchants: MerchantAdmin[];
  onEdit: (merchant: MerchantAdmin) => void;
  onToggleStatus: (id: string) => void;
  onChangeStatus: (id: string, status: Merchant["status"]) => void;
  onChangePlan: (id: string, plan: MerchantAdmin["plan"]) => void;
  onManageCatalog?: (merchantId: string) => void;
  filterStatus?: MerchantAdmin["status"] | "all";
};



export function MerchantsTable({
  merchants,
  onEdit,
  onToggleStatus,
  onChangeStatus,
  onChangePlan,
  onManageCatalog,
  filterStatus = "all",
}: MerchantsTableProps) {


  const filtered =
    filterStatus === "all"
      ? merchants
      : merchants.filter((m) => m.status === filterStatus);

  if (filtered.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma loja encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((merchant) => (
        <MerchantRow
          key={merchant.id}
          merchant={merchant}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onChangePlan={onChangePlan}
          onManageCatalog={onManageCatalog}
        />

      ))}
    </div>
  );
}