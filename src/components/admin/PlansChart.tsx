import { AdminStats } from "@/data/admin";

const planLabels = {
  free: "Grátis",
  essential: "R$29",
  sales: "R$79",
  pro: "R$149",
};

const planColors = {
  free: "bg-slate-400",
  essential: "bg-blue-400",
  sales: "bg-emerald-500",
  pro: "bg-amber-500",
};

const planBgColors = {
  free: "bg-slate-400/20",
  assisted: "bg-blue-400/20",
  local_featured: "bg-emerald-500/20",
  highlighted: "bg-violet-600/20",
  premium_partner: "bg-amber-500/20",
};

export function PlansChart({ stats }: { stats: AdminStats | null }) {
  if (!stats) return null;

  const total = stats.totalMerchants;
  const plans = [
    { key: "free" as const, name: "Presença Local", count: stats.planDistribution.free },
    { key: "essential" as const, name: "Bairro Essencial", count: stats.planDistribution.essential },
    { key: "sales" as const, name: "Bairro Vendas", count: stats.planDistribution.sales },
    { key: "pro" as const, name: "Bairro Pro", count: stats.planDistribution.pro },
  ];

  return (
    <div className="w-full">
      <div className="space-y-6">

      <div className="space-y-4">
        {plans.map((plan) => {
          const percentage = total > 0 ? Math.round((plan.count / total) * 100) : 0;
          return (
            <div key={plan.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${planColors[plan.key]}`} />
                  <span className="text-sm font-bold text-slate-700">
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
              <div className="w-full bg-slate-50 border border-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full ${planColors[plan.key]} transition-all duration-1000 shadow-sm`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Summary */}
      <div className="mt-10 pt-8 border-t border-slate-50">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Receita por Nível</h4>
        <div className="grid grid-cols-2 gap-4">
          {plans
            .filter((p) => p.key !== "free")
            .map((plan) => {
              const revenue = plan.count * (plan.key === "essential" ? 29 : plan.key === "sales" ? 79 : 149);
              return (
                <div key={plan.key} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 group hover:bg-white hover:shadow-md transition-all">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{plan.name.split(' ')[0]}</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">R$ {revenue.toLocaleString()}</p>
                </div>
              );
            })}
        </div>
      </div>
      </div>
    </div>
  );
}
