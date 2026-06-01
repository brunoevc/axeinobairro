import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import React from "react";
import { 
  Eye, 
  Edit3, 
  Power,
  ChevronRight,
  Plus,
  Store,
  TrendingUp,
  MessageSquare,
  Instagram as InstagramIcon,
  MessageCircle,
  Users,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { merchants as initialMerchants } from "@/data/merchants";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/lojas")({
  component: AdminLojas,
});

function AdminLojas() {
  const navigate = useNavigate();
  // Simulating local state for promotions
  const [merchantsList, setMerchantsList] = useState(
    initialMerchants.slice(0, 3).map(m => ({ ...m }))
  );

  const togglePromotion = (id: string) => {
    setMerchantsList(prev => prev.map(m => 
      m.id === id ? { ...m, promotion: { ...m.promotion, isActive: !m.promotion.isActive } } : m
    ));
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Minhas Lojas</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">
            Gerencie seus anúncios, promoções e veja seu desempenho.
          </p>
        </div>
        <Button asChild className="rounded-2xl font-black gap-2 h-14 px-8 bg-violet-600 hover:bg-violet-700 shadow-xl shadow-violet-200 transition-all active:scale-95">
          <Link to="/cadastro">
            <Plus className="h-5 w-5" />
            Cadastrar Nova Loja
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="xl:col-span-2 flex items-center gap-3">
          <div className="p-2 bg-violet-100 rounded-lg">
            <Store className="h-5 w-5 text-violet-600" />
          </div>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            Lojas Ativas ({merchantsList.length})
          </h2>
        </div>

        {merchantsList.map(merchant => (
          <div 
            key={merchant.id} 
            className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 group relative"
          >
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-24 h-24 rounded-3xl overflow-hidden shrink-0 border border-slate-100 shadow-lg group-hover:scale-105 transition-transform duration-500">
                <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-slate-900 truncate">{merchant.name}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="text-[10px] font-black uppercase px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100">
                    {merchant.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <MapPin className="w-3 h-3 text-violet-500" />
                    {merchant.neighborhood}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${merchant.promotion.isActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-slate-200'}`} />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Selo de Promoção</p>
                  <p className={`text-sm font-black ${merchant.promotion.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {merchant.promotion.isActive ? 'Ativa e visível para todos' : 'Pausada no momento'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => togglePromotion(merchant.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${merchant.promotion.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'}`}
              >
                <Power className="h-4 w-4" />
                {merchant.promotion.isActive ? 'Desativar' : 'Ativar'}
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                asChild
                variant="outline" 
                className="rounded-2xl h-14 text-sm font-black border-slate-200 flex items-center gap-2 bg-white hover:bg-slate-50 hover:text-violet-600 transition-all"
              >
                <Link to="/negocios/$id" params={{ id: merchant.id }} className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Visualizar Página
                </Link>
              </Button>
              <Button 
                className="rounded-2xl h-14 text-sm font-black flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-900 border-none transition-all"
              >
                <Edit3 className="h-5 w-5" />
                Editar Informações
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <section className="mt-8 p-10 md:p-14 bg-violet-600 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl shadow-violet-200">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-violet-400/20 rounded-full blur-[80px] -ml-20 -mb-20" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-6 h-6 text-violet-200" />
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-violet-200">Desempenho Geral (30 dias)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-3 mb-4 opacity-60">
                <Users className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Visualizações</p>
              </div>
              <p className="text-5xl font-black tracking-tighter">1.402</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black mt-4">
                +12% vs mês anterior
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-3 mb-4 opacity-60">
                <MessageSquare className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Contatos WhatsApp</p>
              </div>
              <p className="text-5xl font-black tracking-tighter">84</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black mt-4">
                +5% vs mês anterior
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-3 mb-4 opacity-60">
                <InstagramIcon className="w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Cliques Instagram</p>
              </div>
              <p className="text-5xl font-black tracking-tighter">56</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/60 text-[10px] font-black mt-4 uppercase">
                Estável
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-black/10 rounded-3xl border border-white/5">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                   <ShieldCheck className="w-6 h-6 text-violet-200" />
                </div>
                <p className="text-sm font-medium text-violet-100 max-w-xs">Seu perfil está 100% otimizado e visível para todos os bairros vizinhos.</p>
             </div>
             <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl transition-all">
               Baixar Relatório PDF
               <ChevronRight className="h-4 w-4" />
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}

import { MapPin } from "lucide-react";
