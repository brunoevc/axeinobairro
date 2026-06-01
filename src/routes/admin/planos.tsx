import { createFileRoute, Link } from "@tanstack/react-router";
import { useAdminState } from "@/hooks/useAdminState";
import { PlansChart } from "@/components/admin/PlansChart";
import { ArrowLeft, CreditCard, TrendingUp, DollarSign, Target, BarChart3, ShieldCheck, Zap, ChevronRight } from "lucide-react";
import React from "react";

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
    icon: Zap,
    color: "bg-slate-50 text-slate-400 border-slate-100"
  },
  assisted: {
    name: "Cadastro Assistido",
    price: "R$ 27",
    description: "Seu perfil feito pela equipe Axêi",
    icon: Target,
    color: "bg-blue-50 text-blue-600 border-blue-100"
  },
  local_featured: {
    name: "Destaque Local",
    price: "R$ 47",
    description: "Apareça em destaque no seu bairro e categoria",
    icon: TrendingUp,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100"
  },
  highlighted: {
    name: "Loja em Destaque",
    price: "R$ 97",
    description: "Prioridade máxima na listagem com banner",
    icon: ShieldCheck,
    color: "bg-violet-50 text-violet-600 border-violet-100"
  },
  premium_partner: {
    name: "Parceiro Premium",
    price: "R$ 147",
    description: "Máxima exposição com página completa",
    icon: CreditCard,
    color: "bg-amber-50 text-amber-600 border-amber-100"
  },
};

function AdminPlans() {
  const { state, stats, loading } = useAdminState();

  if (loading || !state || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-slate-400 font-black animate-pulse">Analizando métricas...</p>
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

  const totalRevenue = stats.planRevenue.assisted +
    stats.planRevenue.local_featured +
    stats.planRevenue.highlighted +
    stats.planRevenue.premium_partner;

  const paidMerchants = state.merchants.filter((m) => m.plan !== "free").length;
  const conversionRate = Math.round((paidMerchants / (stats.totalMerchants || 1)) * 100);
  const arpu = Math.round(totalRevenue / (paidMerchants || 1));

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">
            Estratégia de <span className="text-orange-600">Planos</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Acompanhamento de conversão e monetização da base de lojistas.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-violet-50 rounded-2xl border border-violet-100">
              <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">Meta Mensal: R$ 10.000</span>
           </div>
        </div>
      </header>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm group hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform"><DollarSign className="h-6 w-6" /></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Receita Mensal (MRR)</p>
          </div>
          <p className="text-5xl font-black text-slate-900 tracking-tighter">
            R$ {totalRevenue.toLocaleString()}
          </p>
          <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
             <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
               <TrendingUp className="h-4 w-4" /> +8.4% este mês
             </span>
             <span className="text-[10px] font-bold text-slate-300 uppercase">Previsão</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm group hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform"><Target className="h-6 w-6" /></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Taxa de Conversão</p>
          </div>
          <p className="text-5xl font-black text-slate-900 tracking-tighter">
            {conversionRate}%
          </p>
          <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
             <span className="text-xs font-bold text-slate-500">
               {paidMerchants} lojistas pagos
             </span>
             <span className="text-[10px] font-bold text-slate-300 uppercase">Premium</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm group hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-violet-50 rounded-2xl text-violet-600 group-hover:scale-110 transition-transform"><CreditCard className="h-6 w-6" /></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ARPU (Ticket Médio)</p>
          </div>
          <p className="text-5xl font-black text-slate-900 tracking-tighter">
            R$ {arpu}
          </p>
          <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
             <span className="text-xs font-bold text-slate-500">
               Média por assinatura
             </span>
             <span className="text-[10px] font-bold text-slate-300 uppercase">Mensal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 pb-20">
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Distribuição Visual</h3>
               <BarChart3 className="w-5 h-5 text-violet-500" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
               <PlansChart stats={stats} />
            </div>
            <div className="mt-10 pt-8 border-t border-slate-50 space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insights Estratégicos</p>
              <div className="space-y-4">
                 <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-violet-600 mt-1.5" />
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">
                       O plano <span className="text-slate-900">Destaque Local</span> possui o maior ROI percebido pelos usuários.
                    </p>
                 </div>
                 <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-violet-600 mt-1.5" />
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">
                       60% dos novos cadastros começam no <span className="text-slate-900">Grátis</span> e migram em até 15 dias.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-4">
             <h3 className="text-xl font-black text-slate-900 tracking-tight">Performance por Nível</h3>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preços e Adesão Atual</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {planKeys.map((key) => {
              const count = stats.planDistribution[key];
              const detail = planDetails[key];
              const Icon = detail.icon;
              
              return (
                <div
                  key={key}
                  className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center justify-between group hover:border-violet-600 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-all group-hover:scale-110 ${detail.color}`}>
                       <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight tracking-tight">{detail.name}</h4>
                      <p className="text-[10px] font-black text-violet-600 uppercase tracking-[0.2em] mt-1">{detail.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                       <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Impacto</p>
                       <div className="flex gap-1">
                          {[1,2,3,4,5].map(i => (
                             <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= (key === 'free' ? 1 : key === 'assisted' ? 2 : 4) ? 'bg-violet-600' : 'bg-slate-100'}`} />
                          ))}
                       </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 text-right min-w-[100px] group-hover:bg-violet-600 group-hover:border-violet-600 transition-colors">
                      <p className="text-2xl font-black text-slate-900 group-hover:text-white transition-colors">{count}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-violet-200 transition-colors">Lojistas</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between gap-8 mt-10">
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                   <Zap className="w-7 h-7 text-amber-400 fill-amber-400" />
                </div>
                <div>
                   <h4 className="text-lg font-black tracking-tight mb-1">Novo Plano em Estudo</h4>
                   <p className="text-slate-400 text-xs font-medium">Lançamento de Plano de Bairro Exclusivo para Junho.</p>
                </div>
             </div>
             <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
