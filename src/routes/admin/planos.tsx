import { createFileRoute, Link } from "@tanstack/react-router";
import { useAdminState } from "@/hooks/useAdminState";
import { PlansChart } from "@/components/admin/PlansChart";
import { ArrowLeft, CreditCard, TrendingUp, DollarSign, Target } from "lucide-react";

export const Route = createFileRoute("/admin/planos")({
  component: AdminPlans,
  head: () => ({
    meta: [
      { title: "Planos — Admin Axêi" },
      { name: "description", content: "Análise de distribuição de planos" },
    ],
  }),
});

const planDetails = {
  free: {
    name: "Presença Local",
    price: "Grátis",
    description: "Cadastro básico com visibilidade na sua região",
  },
  assisted: {
    name: "Cadastro Assistido",
    price: "R$ 27",
    description: "Seu perfil feito pela equipe Axêi",
  },
  local_featured: {
    name: "Destaque Local",
    price: "R$ 47",
    description: "Apareça em destaque no seu bairro e categoria",
  },
  highlighted: {
    name: "Loja em Destaque",
    price: "R$ 97",
    description: "Prioridade máxima na listagem com banner",
  },
  premium_partner: {
    name: "Parceiro Premium",
    price: "R$ 147",
    description: "Máxima exposição com página completa",
  },
};

function AdminPlans() {
  const { state, stats, loading } = useAdminState();

  if (loading || !state || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground font-bold animate-pulse">Analizando métricas...</p>
      </div>
    );
  }

  const planKeys: (keyof typeof planDetails)[] = [
    "free",
    "assisted",
    "local_featured",
    "highlighted",
    "premium_partner",
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Estratégia de Planos</h1>
        <p className="text-muted-foreground font-medium text-sm">
          Acompanhamento de conversão e monetização da base de lojistas.
        </p>
      </header>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><DollarSign className="h-4 w-4" /></div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Receita Mensal</p>
          </div>
          <p className="text-4xl font-black text-foreground">
            R$ {(
                stats.planRevenue.assisted +
                stats.planRevenue.local_featured +
                stats.planRevenue.highlighted +
                stats.planRevenue.premium_partner
              ).toLocaleString()}
          </p>
          <p className="text-xs font-bold text-whatsapp mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +8.4% vs mês anterior
          </p>
        </div>

        <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Target className="h-4 w-4" /></div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Taxa de Conversão</p>
          </div>
          <p className="text-4xl font-black text-foreground">
            {Math.round((state.merchants.filter((m) => m.plan !== "free").length / stats.totalMerchants) * 100)}%
          </p>
          <p className="text-xs font-bold text-muted-foreground mt-2">
            {state.merchants.filter((m) => m.plan !== "free").length} lojistas pagos
          </p>
        </div>

        <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><CreditCard className="h-4 w-4" /></div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ticket Médio</p>
          </div>
          <p className="text-4xl font-black text-foreground">
            R$ {Math.round((stats.planRevenue.assisted + stats.planRevenue.local_featured + stats.planRevenue.highlighted + stats.planRevenue.premium_partner) / (state.merchants.filter((m) => m.plan !== "free").length || 1))}
          </p>
          <p className="text-xs font-bold text-muted-foreground mt-2">por lojista premium</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border/40 rounded-[2.5rem] p-8 shadow-sm h-full">
            <h3 className="text-lg font-black text-foreground mb-6">Distribuição Visual</h3>
            <PlansChart stats={stats} />
            <div className="mt-8 pt-6 border-t border-border/40 space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Insights Rápidos</p>
              <ul className="text-xs text-muted-foreground font-medium space-y-2">
                <li className="flex items-center gap-2">● O plano <span className="text-foreground font-bold">Destaque Local</span> é o mais atrativo.</li>
                <li className="flex items-center gap-2">● 60% dos novos cadastros começam no <span className="text-foreground font-bold">Grátis</span>.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-lg font-black text-foreground">Performance por Nível</h3>
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Preços e Adesão</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {planKeys.map((key) => {
              const count = stats.planDistribution[key];
              const detail = planDetails[key];
              
              return (
                <div
                  key={key}
                  className="bg-card border border-border/40 rounded-3xl p-5 flex items-center justify-between group hover:border-primary/30 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/50 rounded-2xl flex items-center justify-center text-xl">
                       {key === 'free' ? '🌱' : key === 'assisted' ? '🤝' : key === 'local_featured' ? '📍' : key === 'highlighted' ? '✨' : '💎'}
                    </div>
                    <div>
                      <h4 className="font-black text-foreground text-sm leading-tight">{detail.name}</h4>
                      <p className="text-[11px] font-bold text-muted-foreground">{detail.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-foreground">{count}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Lojistas</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}