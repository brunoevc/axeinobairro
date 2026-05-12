import { AdminStats } from "@/data/admin";

type StatCard = {
  label: string;
  value: string | number;
  icon: string;
  color: "accent" | "emerald" | "blue" | "amber" | "rose";
  trend?: string;
};

function StatCardComponent({ stat }: { stat: StatCard }) {
  const colorMap = {
    accent: "bg-accent/10 text-accent",
    emerald: "bg-emerald-500/10 text-emerald-600",
    blue: "bg-blue-500/10 text-blue-600",
    amber: "bg-amber-500/10 text-amber-600",
    rose: "bg-rose-500/10 text-rose-600",
  };

  return (
    <div className="rounded-xl bg-card p-5 border border-accent/10 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
          {stat.trend && <p className="text-xs text-emerald-600 mt-1">{stat.trend}</p>}
        </div>
        <div className={`text-2xl rounded-lg p-3 ${colorMap[stat.color]}`}>
          {stat.icon}
        </div>
      </div>
    </div>
  );
}

export function DashboardStats({ stats }: { stats: AdminStats | null }) {
  if (!stats) return null;

  const cards: StatCard[] = [
    {
      label: "Total de Lojas",
      value: stats.totalMerchants,
      icon: "🏪",
      color: "accent",
    },
    {
      label: "Lojas Ativas",
      value: stats.activeMerchants,
      icon: "✅",
      color: "emerald",
    },
    {
      label: "Pendentes",
      value: stats.pendingMerchants,
      icon: "⏳",
      color: "amber",
    },
    {
      label: "Em Destaque",
      value: stats.featuredMerchants,
      icon: "⭐",
      color: "blue",
    },
    {
      label: "Cliques WhatsApp",
      value: stats.totalWhatsappClicks,
      icon: "💬",
      color: "accent",
    },
    {
      label: "Rating Médio",
      value: stats.averageRating.toFixed(1),
      icon: "⭐",
      color: "rose",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <StatCardComponent key={idx} stat={card} />
      ))}
    </div>
  );
}
