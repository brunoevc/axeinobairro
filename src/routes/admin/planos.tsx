import { createFileRoute } from "@tanstack/react-router";
import { useAdminState } from "@/hooks/useAdminState";
import { PlansChart } from "@/components/admin/PlansChart";
import { MerchantAdmin } from "@/data/admin";

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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando...</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Distribuição de Planos
        </h1>
        <p className="text-muted-foreground">
          Análise de adoção e receita dos planos
        </p>
      </div>

      {/* Main Chart */}
      <PlansChart stats={stats} />

      {/* Detailed Plan Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">
          Detalhes por Plano
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {planKeys.map((key) => {
            const count = stats.planDistribution[key];
            const detail = planDetails[key];
            const revenue =
              key === "free"
                ? 0
                : key === "assisted"
                  ? count * 27
                  : key === "local_featured"
                    ? count * 47
                    : key === "highlighted"
                      ? count * 97
                      : count * 147;

            const merchants = state.merchants.filter((m) => m.plan === key);
            const avgClicks =
              merchants.length > 0
                ? Math.round(
                    merchants.reduce((sum, m) => sum + (m.whatsappClicks || 0), 0) /
                      merchants.length
                  )
                : 0;

            return (
              <div
                key={key}
                className="rounded-xl bg-card p-6 border border-accent/10 shadow-sm hover:border-accent/30 transition-colors"
              >
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-foreground">
                    {detail.name}
                  </h4>
                  <p className="text-sm text-accent font-semibold mt-1">
                    {detail.price}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {detail.description}
                  </p>
                </div>

                <div className="bg-background/50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Lojistas Contratados
                    </p>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                  </div>

                  {key !== "free" && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Receita Potencial
                      </p>
                      <p className="text-2xl font-bold text-accent">
                        R$ {revenue.toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Cliques Médios (WhatsApp)
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {avgClicks}
                    </p>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="text-xs text-muted-foreground">
                    <p>
                      {((count / stats.totalMerchants) * 100).toFixed(1)}% do
                      total
                    </p>
                  </div>
                </div>

                {count === 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-muted/30 text-center">
                    <p className="text-xs text-muted-foreground">
                      Sem lojistas neste plano
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">
          Resumo Financeiro
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Receita Total</p>
            <p className="text-2xl font-bold text-foreground">
              R${" "}
              {(
                stats.planRevenue.assisted +
                stats.planRevenue.local_featured +
                stats.planRevenue.highlighted +
                stats.planRevenue.premium_partner
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Receita Média por Loja
            </p>
            <p className="text-2xl font-bold text-foreground">
              R${" "}
              {(
                (stats.planRevenue.assisted +
                  stats.planRevenue.local_featured +
                  stats.planRevenue.highlighted +
                  stats.planRevenue.premium_partner) /
                (stats.totalMerchants || 1)
              ).toFixed(0)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Lojistas Pagos</p>
            <p className="text-2xl font-bold text-foreground">
              {state.merchants.filter((m) => m.plan !== "free").length}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Taxa de Conversão</p>
            <p className="text-2xl font-bold text-foreground">
              {(
                ((state.merchants.filter((m) => m.plan !== "free").length) /
                  stats.totalMerchants) *
                100
              ).toFixed(0)}
              %
            </p>
          </div>
        </div>
      </div>

      {/* Plano Mais Popular */}
      <div className="rounded-xl bg-card p-6 border border-accent/10 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-4">
          📊 Insights
        </h3>

        <ul className="space-y-2 text-sm text-foreground">
          <li>
            ✓ Plano mais popular:{" "}
            <span className="font-bold">
              {
                planKeys.reduce((prev, key) =>
                  stats.planDistribution[key] >
                  stats.planDistribution[prev]
                    ? key
                    : prev
                )
              }
              ({" "}
              {
                stats.planDistribution[
                  planKeys.reduce((prev, key) =>
                    stats.planDistribution[key] >
                    stats.planDistribution[prev]
                      ? key
                      : prev
                  )
                ]
              }{" "}
              lojas)
            </span>
          </li>

          <li>
            ✓ Cliques médios por loja:{" "}
            <span className="font-bold">
              {Math.round(stats.totalWhatsappClicks / stats.totalMerchants)}
            </span>
          </li>

          <li>
            ✓ Lojistas em planos pagos:{" "}
            <span className="font-bold">
              {state.merchants.filter((m) => m.plan !== "free").length} (
              {(
                ((state.merchants.filter((m) => m.plan !== "free").length) /
                  stats.totalMerchants) *
                100
              ).toFixed(0)}
              %)
            </span>
          </li>

          <li>
            ✓ Receita potencial mensal:{" "}
            <span className="font-bold">
              R${" "}
              {(
                stats.planRevenue.assisted +
                stats.planRevenue.local_featured +
                stats.planRevenue.highlighted +
                stats.planRevenue.premium_partner
              ).toLocaleString()}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
