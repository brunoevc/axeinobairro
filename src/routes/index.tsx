import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Search, 
  MapPin, 
  LayoutGrid,
  ArrowRight,
  PlusCircle,
  Tag,
  Star
} from "lucide-react";
import { merchants, categories } from "@/data/merchants";
import { MerchantCard } from "@/components/MerchantCard";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Axêi no Bairro — Marketplace Local" },
      {
        name: "description",
        content: "Encontre os melhores comércios, serviços e promoções no seu bairro.",
      },
    ],
  }),
});

function Index() {
  const navigate = useNavigate();
  const featuredMerchants = merchants.filter(m => m.featured).slice(0, 3);
  const promotionalMerchants = merchants.filter(m => m.promotion.isActive).slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-24 font-sans selection:bg-primary/20">
      {/* Header / Hero */}
      <header className="relative px-6 pt-12 pb-16 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -ml-20 -mb-20 animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <MapPin className="h-3 w-3" />
            Marketplace Hiperlocal
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-4">
            Axêi no <span className="text-primary">Bairro</span>
          </h1>
          <p className="text-muted-foreground text-base font-medium mb-8 leading-relaxed">
            Encontre comércios, serviços e promoções <br /> pertinho de você em segundos.
          </p>
          
          <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-center">
            <button 
              onClick={() => navigate({ to: '/negocios' })}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Ver negócios
              <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => navigate({ to: '/cadastro' })}
              className="px-8 py-4 bg-card border border-border/60 text-foreground rounded-2xl font-bold hover:bg-secondary/50 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-4 w-4 text-primary" />
              Cadastrar meu negócio
            </button>
          </div>
        </div>
      </header>

      {/* Category Grid */}
      <section className="px-6 -mt-8 relative z-20">
        <div className="bg-card/70 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-primary" />
              Categorias
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => navigate({ to: '/negocios', search: { category: cat.slug } })}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {cat.slug === 'padaria' && '🥐'}
                    {cat.slug === 'restaurante' && '🍕'}
                    {cat.slug === 'mercado' && '🛒'}
                    {cat.slug === 'farmacia' && '💊'}
                    {cat.slug === 'beleza' && '✂️'}
                    {cat.slug === 'servicos' && '🔧'}
                    {cat.slug === 'pet' && '🐾'}
                    {cat.slug === 'roupas' && '👕'}
                    {cat.slug === 'saude' && '🩺'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-center uppercase tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="px-6 mt-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl font-black text-foreground">Negócios em Destaque</h2>
            <p className="text-xs text-muted-foreground font-medium">Os queridinhos da comunidade</p>
          </div>
          <button 
            onClick={() => navigate({ to: '/negocios' })}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            Ver todos
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMerchants.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} />
          ))}
        </div>
      </section>

      {/* Promotions Section */}
      <section className="px-6 mt-16 pb-8">
        <div className="bg-primary/5 rounded-[3rem] p-8 border border-primary/10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-widest mb-2">
                <Tag className="h-3 w-3" />
                Economia Real
              </div>
              <h2 className="text-2xl font-black text-foreground">Promoções do Bairro</h2>
              <p className="text-sm text-muted-foreground font-medium">Aproveite as ofertas exclusivas perto de você</p>
            </div>
            <button 
              onClick={() => navigate({ to: '/negocios' })}
              className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
            >
              Ver todas
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotionalMerchants.map((merchant) => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Floating Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-xl border border-border/40 rounded-full px-6 py-3 shadow-2xl flex items-center gap-10 z-50">
        <button onClick={() => navigate({ to: '/' })} className="text-primary flex flex-col items-center gap-0.5">
          <LayoutGrid className="h-5 w-5" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Início</span>
        </button>
        <button onClick={() => navigate({ to: '/negocios' })} className="text-muted-foreground hover:text-primary transition-colors flex flex-col items-center gap-0.5">
          <Search className="h-5 w-5" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Buscar</span>
        </button>
        <button onClick={() => navigate({ to: '/cadastro' })} className="text-muted-foreground hover:text-primary transition-colors flex flex-col items-center gap-0.5">
          <PlusCircle className="h-5 w-5" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Anunciar</span>
        </button>
      </nav>
    </div>
  );
}