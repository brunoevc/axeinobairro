import { createFileRoute } from "@tanstack/react-router";
import { useAdminState } from "@/hooks/useAdminState";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { PlansChart } from "@/components/admin/PlansChart";
import { ActivityLog } from "@/components/admin/ActivityLog";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — Admin Axêi" },
      { name: "description", content: "Visão geral do marketplace" },
    ],
  }),
});

function AdminDashboard() {
  const { stats, state, loading } = useAdminState();

  if (loading || !stats || !state) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg text-muted-foreground font-bold animate-pulse">Sincronizando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Visão Geral do <span className="text-primary">Marketplace</span>
        </h1>
        <p className="text-muted-foreground font-medium">
          Métricas de engajamento e status operacional da rede.
        </p>
      </div>

      {/* Stats Grid */}
      <section>
        <DashboardStats stats={stats} />
      </section>

      {/* Plans and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section>
          <div className="mb-6">
            <h3 className="text-lg font-black text-foreground">Distribuição de Planos</h3>
            <p className="text-xs text-muted-foreground font-medium">Divisão dos lojistas por nível de assinatura</p>
          </div>
          <div className="bg-card border border-border/40 rounded-[2.5rem] p-6 shadow-sm">
            <PlansChart stats={stats} />
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h3 className="text-lg font-black text-foreground">Atividade Recente</h3>
            <p className="text-xs text-muted-foreground font-medium">Últimas interações e aprovações no sistema</p>
          </div>
          <div className="bg-card border border-border/40 rounded-[2.5rem] p-6 shadow-sm max-h-[450px] overflow-y-auto scrollbar-hide">
            <ActivityLog actions={state.actions} />
          </div>
        </section>
      </div>

      {/* Detailed Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Neighborhoods */}
        <div className="rounded-[2.5rem] bg-card p-8 border border-border/40 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-black text-foreground">Lojas por Bairro</h3>
            <p className="text-xs text-muted-foreground font-medium">Densidade comercial por região</p>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.merchantsByNeighborhood)
              .sort(([, a], [, b]) => b - a)
              .map(([neighborhood, count]) => (
                <div
                  key={neighborhood}
                  className="flex items-center justify-between group"
                >
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">{neighborhood}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${(count / stats.totalMerchants) * 100}%` }}
                      />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">
                      {count} {count === 1 ? 'loja' : 'lojas'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Contact Metrics */}
        <div className="rounded-[2.5rem] bg-card p-8 border border-border/40 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-black text-foreground">Métricas de Conversão</h3>
            <p className="text-xs text-muted-foreground font-medium">Engajamento real com os lojistas</p>
          </div>
          <div className="space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                  Total Cliques Whats
                </p>
                <p className="text-5xl font-black text-foreground tracking-tighter">
                  {stats.totalWhatsappClicks}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-whatsapp">
                  Média: {stats.totalMerchants > 0 ? (stats.totalWhatsappClicks / stats.totalMerchants).toFixed(1) : 0}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground">por estabelecimento</p>
              </div>
            </div>

            <div className="h-px bg-border/40 w-full" />

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                  Interesse Local
                </p>
                <p className="text-5xl font-black text-foreground tracking-tighter">
                  {stats.totalContactAttempts}
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase">
                  {stats.totalContactAttempts > 0
                    ? Math.round((stats.totalWhatsappClicks / stats.totalContactAttempts) * 100)
                    : 0}% Conversão
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Box */}
      <div className="rounded-[2rem] bg-secondary/30 border border-border/40 p-8">
        <h3 className="font-black text-foreground mb-4 flex items-center gap-2">
          <span className="p-1.5 bg-primary/10 rounded-lg text-primary text-xs">ℹ</span>
          Ambiente de Demonstração
        </h3>
        <ul className="text-xs text-muted-foreground font-medium space-y-3">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            Os dados acima são simulados e persistidos localmente no seu navegador.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            Este painel representa a visão do administrador da plataforma Axêi no Bairro.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            Sincronização em tempo real ativada para este protótipo.
          </li>
        </ul>
        <div className="mt-8 pt-6 border-t border-border/40 flex justify-between items-center">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">v1.0.0 Stable Build</span>
          <span className="text-[10px] font-bold text-muted-foreground">Atualizado em: {new Date(state.lastUpdated).toLocaleTimeString("pt-BR")}</span>
        </div>
      </div>
    </div>
  );
}