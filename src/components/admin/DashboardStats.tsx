import { AdminStats, AdminState } from "@/data/admin";
import { 
  Users, 
  Store, 
  MessageSquare, 
  TrendingUp, 
  Eye, 
  Instagram, 
  Navigation, 
  Share2,
  Target,
  DollarSign
} from "lucide-react";
import { getLeads } from "@/lib/leads";
import { useMemo } from "react";


export function DashboardStats({ stats, state }: { stats: AdminStats, state: AdminState }) {
  const leads = useMemo(() => getLeads(), []);
  const totalLeadValue = leads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
  const conversionRate = leads.length > 0 
    ? Math.round((leads.filter(l => l.status === 'cliente').length / leads.length) * 100) 
    : 0;

  const mainStats = [

    {
      label: "Total de Lojas",
      value: stats.totalMerchants,
      icon: Store,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Visualizações",
      value: state.merchants.reduce((acc, m) => acc + (m.views || 0), 0),
      icon: Eye,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      label: "Contatos WhatsApp",
      value: stats.totalWhatsappClicks,
      icon: MessageSquare,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Buscas (Apareceu)",
      value: state.merchants.reduce((acc, m) => acc + (m.searchAppearances || 0), 0),
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const commercialStats = [
    {
      label: "Total de Leads",
      value: leads.length,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Conversão CRM",
      value: `${conversionRate}%`,
      icon: Target,
      color: "text-violet-600",
    },
    {
      label: "Valor em Funil",
      value: `R$ ${totalLeadValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: "text-emerald-600",
    },
  ];

  const conversionStats = [

    {
      label: "Cliques Instagram",
      value: state.merchants.reduce((acc, m) => acc + (m.instagramClicks || 0), 0),
      icon: Instagram,
      color: "text-pink-600",
    },
    {
      label: "Cliques em Rota",
      value: state.merchants.reduce((acc, m) => acc + (m.routeClicks || 0), 0),
      icon: Navigation,
      color: "text-blue-500",
    },
    {
      label: "Compartilhamentos",
      value: state.merchants.reduce((acc, m) => acc + (m.shareClicks || 0), 0),
      icon: Share2,
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm group hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-2xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{stat.label}</p>
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {commercialStats.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center justify-between group hover:border-orange-200 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl bg-slate-50 ${stat.color} group-hover:bg-white group-hover:shadow-sm transition-all`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {conversionStats.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center justify-between group hover:border-orange-200 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl bg-slate-50 ${stat.color} group-hover:bg-white group-hover:shadow-sm transition-all`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
            <p className="text-2xl font-black text-slate-900">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}