import { AdminStats } from "@/data/admin";

const planLabels = {
  free: "Grátis",
  assisted: "R$27",
  local_featured: "R$47",
  highlighted: "R$97",
  premium_partner: "R$147",
};

const planColors = {
  free: "fill-slate-400",
  assisted: "fill-blue-400",
  local_featured: "fill-accent",
  highlighted: "fill-purple-400",
  premium_partner: "fill-rose-400",
};

const planBgColors = {
  free: "bg-slate-400/20",
  assisted: "bg-blue-400/20",
  local_featured: "bg-accent/20",
  highlighted: "bg-purple-400/20",
  premium_partner: "bg-rose-400/20",
};

export function PlansChart({ stats }: { stats: AdminStats | null }) {
  if (!stats) return null;

  const total = stats.totalMerchants;
  const plans = [
    { key: "free" as const, name: "Grátis", count: stats.planDistribution.free },
    { key: "assisted" as const, name: "Cadastro Assistido", count: stats.planDistribution.assisted },
    { key: "local_featured" as const, name: "Destaque Local", count: stats.planDistribution.local_featured },
    { key: "highlighted" as const, name: "Loja em Destaque", count: stats.planDistribution.highlighted },
    { key: "premium_partner" as const, name: "Parceiro Premium", count: stats.planDistribution.premium_partner },
  ];

  return (
    <div className="rounded-xl bg-card p-6 border border-accent/10 shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-6">Distribuição de Planos</h3>

      <div className="space-y-4">
        {plans.map((plan) => {
          const percentage = total > 0 ? Math.round((plan.count / total) * 100) : 0;
          return (
            <div key={plan.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${planBgColors[plan.key]}`} />
                  <span className="text-sm font-medium text-foreground">
                    {plan.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-foreground">{plan.count}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${planColors[plan.key]} transition-all`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Summary */}
      <div className="mt-8 pt-6 border-t border-border">
        <h4 className="text-sm font-bold text-foreground mb-4">Receita Potencial</h4>
        <div className="grid grid-cols-2 gap-3">
          {plans
            .filter((p) => p.key !== "free")
            .map((plan) => {
              const revenue = plan.count * (plan.key === "assisted" ? 27 : plan.key === "local_featured" ? 47 : plan.key === "highlighted" ? 97 : 147);
              return (
                <div key={plan.key} className="bg-background/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{plan.key === "assisted" ? "R$27" : plan.key === "local_featured" ? "R$47" : plan.key === "highlighted" ? "R$97" : "R$147"}</p>
                  <p className="text-lg font-bold text-foreground">R$ {revenue.toLocaleString()}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
