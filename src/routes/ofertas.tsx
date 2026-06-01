import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Tag, ChevronLeft } from "lucide-react";
import { merchants } from "@/data/merchants";
import { MerchantCard } from "@/components/MerchantCard";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Button } from "@/components/ui/button";
import React from "react";

export const Route = createFileRoute("/ofertas")({ 
  component: OffersPage 
});

function OffersPage() {
  const navigate = useNavigate();
  const promotionalMerchants = merchants.filter(m => m.promotion.isActive);

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <TopBar />
      
      <header className="relative bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-60" />
        
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <button 
            onClick={() => navigate({ to: "/" })}
            className="mb-8 p-3 bg-slate-50 rounded-full border border-slate-100 hover:bg-white hover:shadow-md transition-all active:scale-90 inline-flex group"
          >
            <ChevronLeft className="h-5 w-5 text-slate-400 group-hover:text-orange-500" />
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4 shadow-lg shadow-orange-200">
                <Tag className="w-3 h-3" />
                Economia Local
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tighter">
                Ofertas do <span className="text-orange-500">Bairro</span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl font-medium mt-6 max-w-xl leading-relaxed">
                Descontos exclusivos e promoções imperdíveis dos comércios da sua região.
              </p>
            </div>
            
            <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
               <span className="text-2xl font-black text-slate-900 leading-none">{promotionalMerchants.length}</span>
               <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest mt-1">Ofertas Ativas</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {promotionalMerchants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {promotionalMerchants.map((merchant) => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
              <Tag className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Sem ofertas no momento</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
              Fique de olho! Novos descontos são postados todos os dias pelos lojistas do bairro.
            </p>
            <Button 
              onClick={() => navigate({ to: '/negocios' })}
              className="bg-violet-600 hover:bg-violet-700 text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-violet-200 active:scale-95 transition-all"
            >
              Explorar Negócios
            </Button>
          </div>
        )}
      </main>

      <FloatingNav />
    </div>
  );
}
