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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Visão Geral
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao dashboard administrativo do Axêi no Bairro
        </p>
      </div>

      {/* Stats Grid */}
      <section>
        <DashboardStats stats={stats} />
      </section>

      {/* Plans and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <PlansChart stats={stats} />
        </section>

        <section>
          <ActivityLog actions={state.actions} />
        </section>
      </div>

      {/* Detailed Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Neighborhoods */}
        <div className="rounded-xl bg-card p-6 border border-accent/10 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Lojas por Bairro
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.merchantsByNeighborhood)
              .sort(([, a], [, b]) => b - a)
              .map(([neighborhood, count]) => (
                <div
                  key={neighborhood}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-foreground">{neighborhood}</span>
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Contact Metrics */}
        <div className="rounded-xl bg-card p-6 border border-accent/10 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Métricas de Contato
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Total de Cliques WhatsApp
              </p>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalWhatsappClicks}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Média:{" "}
                {stats.totalMerchants > 0
                  ? Math.round(
                      stats.totalWhatsappClicks / stats.totalMerchants
                    )
                  : 0}{" "}
                por loja
              </p>
            </div>

            <div className="h-px bg-border" />

            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Tentativas de Contato
              </p>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalContactAttempts}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Taxa de conversão:{" "}
                {stats.totalContactAttempts > 0
                  ? Math.round(
                      (stats.totalWhatsappClicks /
                        stats.totalContactAttempts) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Box */}
      <div className="rounded-xl bg-accent/5 border border-accent/20 p-6">
        <h3 className="font-bold text-foreground mb-2">ℹ️ Informações</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>✓ Dados persistidos em localStorage</li>
          <li>✓ Sem backend ou base de dados</li>
          <li>✓ Alterações refletidas em tempo real</li>
          <li>✓ Ambiente de teste — não usar em produção</li>
          <li>✓ Última atualização: {new Date(state.lastUpdated).toLocaleString("pt-BR")}</li>
        </ul>
      </div>
    </div>
  );
}
