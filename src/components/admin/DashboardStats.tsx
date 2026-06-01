import { AdminStats } from "@/data/admin";
import { Store, CheckCircle2, Clock, Star, MessageCircle, ShieldCheck } from "lucide-react";
import React from "react";

type StatCard = {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: "violet" | "emerald" | "amber" | "blue" | "rose";
  trend?: string;
};

function StatCardComponent({ stat }: { stat: StatCard }) {
  const Icon = stat.icon;
  
  const colorMap = {
    violet: "bg-violet-50 text-violet-600 border-violet-100 shadow-violet-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100",
  };

  return (
    <div className="rounded-[2rem] bg-white p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {stat.label}
          </p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</p>
          {stat.trend && (
            <div className="flex items-center gap-1.5">
               <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl border transition-all group-hover:scale-110 shadow-sm ${colorMap[stat.color]}`}>
          <Icon className="w-6 h-6" />
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
      icon: Store,
      color: "violet",
      trend: "+4 est. mês"
    },
    {
      label: "Lojas Ativas",
      value: stats.activeMerchants,
      icon: CheckCircle2,
      color: "emerald",
      trend: "92% Ativo"
    },
    {
      label: "Pendentes",
      value: stats.pendingMerchants,
      icon: Clock,
      color: "amber",
      trend: "Ação necessária"
    },
    {
      label: "Em Destaque",
      value: stats.featuredMerchants,
      icon: ShieldCheck,
      color: "blue",
      trend: "Planos Premium"
    },
    {
      label: "Cliques Whats",
      value: stats.totalWhatsappClicks,
      icon: MessageCircle,
      color: "violet",
      trend: "+12.5% vs ont."
    },
    {
      label: "Rating Médio",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: "rose",
      trend: "Baseado em reviews"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {cards.map((card, idx) => (
        <StatCardComponent key={idx} stat={card} />
      ))}
    </div>
  );
}
