import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Map as MapIcon,
  MessageSquare,
  TrendingUp,
  LayoutGrid
} from "lucide-react";
import { neighborhoodStatus, mockWidgets } from "@/data/neighborhood";
import { WidgetCard } from "@/components/WidgetCard";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Meu Bairro Agora — Sua Central Inteligente" },
      {
        name: "description",
        content: "O que acontece no seu bairro, agora. Ofertas, notícias, serviços e IA.",
      },
    ],
  }),
});

function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 font-sans selection:bg-primary/20">
      {/* Dynamic Header */}
      <header className="px-6 pt-10 pb-6 flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-muted-foreground text-sm font-medium">{neighborhoodStatus.greeting}</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              {neighborhoodStatus.name}
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Online" />
            </h1>
          </div>
          <div className="bg-card shadow-sm border border-border/50 rounded-2xl px-3 py-2 flex flex-col items-center">
            <span className="text-lg font-bold text-primary">{neighborhoodStatus.temp}</span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Ensolarado</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="px-3 py-1 bg-primary/10 rounded-full flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-primary" />
            <span className="text-[11px] font-bold text-primary uppercase">Status: {neighborhoodStatus.status}</span>
          </div>
        </div>
      </header>

      {/* AI Search Assistant */}
      <section className="px-6 mb-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex items-center bg-card border border-border/60 rounded-[2rem] shadow-[var(--shadow-card)] p-1">
            <div className="pl-5 pr-3">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <input 
              type="text" 
              placeholder="O que você procura no bairro hoje?"
              className="w-full py-4 bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navigate({ to: '/ia-assistente' })}
            />
            <button 
              onClick={() => navigate({ to: '/ia-assistente' })}
              className="mr-1 p-3.5 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all active:scale-95"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Widget Grid */}
      <section className="px-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-primary" />
            Meu Bairro Agora
          </h2>
          <button 
            onClick={() => navigate({ to: '/conferir-tudo' })}
            className="text-xs font-bold text-primary hover:underline"
          >
            Conferir tudo
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {mockWidgets.map((widget) => (
            <WidgetCard key={widget.id} widget={widget} />
          ))}
          
          {/* Card Especial Pulso do Bairro (Full Width) */}
          <div 
            onClick={() => navigate({ to: '/pulso' })}
            className="col-span-2 p-6 bg-gradient-to-br from-primary to-primary/80 rounded-[2rem] shadow-lg text-white relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
              <TrendingUp className="h-24 w-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Pulso do Bairro</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">142</p>
                  <p className="text-[10px] uppercase opacity-70">Locais Ativos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-[10px] uppercase opacity-70">Novas Ofertas</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                <p className="text-xs font-medium">Bombando: <span className="font-bold underline">Feira Orgânica</span></p>
                <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Ver Ao Vivo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Floating Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-xl border border-border/50 rounded-full px-6 py-4 shadow-2xl flex items-center gap-8 z-50">
        <button onClick={() => navigate({ to: '/' })} className="text-primary"><LayoutGrid className="h-6 w-6" /></button>
        <button onClick={() => navigate({ to: '/ia-assistente' })} className="text-muted-foreground hover:text-primary transition-colors"><MessageSquare className="h-6 w-6" /></button>
        <button onClick={() => navigate({ to: '/mapa' })} className="text-muted-foreground hover:text-primary transition-colors"><MapIcon className="h-6 w-6" /></button>
        <button onClick={() => navigate({ to: '/perfil' })} className="text-muted-foreground hover:text-primary transition-colors"><div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-accent" /></button>
      </nav>
    </div>
  );
}


