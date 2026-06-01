import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  Settings, 
  Store, 
  Tag, 
  Eye, 
  Edit3, 
  Power,
  ChevronRight,
  Plus
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
    <div className="min-h-screen bg-background pb-12">
      <header className="px-6 pt-12 pb-8 bg-card border-b border-border/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="flex justify-between items-center mb-6 relative z-10">
          <button 
            onClick={() => navigate({ to: "/" })}
            className="p-3 bg-secondary/50 rounded-full border border-border/40 active:scale-90 transition-all inline-flex"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button className="p-3 bg-secondary/50 rounded-full border border-border/40">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-foreground leading-tight">
            Painel do <span className="text-primary">Lojista</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Gerencie seus anúncios e promoções
          </p>
        </div>
      </header>

      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Minhas Lojas</h2>
          <Button asChild size="sm" className="rounded-xl font-bold gap-1 text-[11px] h-8">
            <Link to="/cadastro">
              <Plus className="h-3 w-3" />
              Nova Loja
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {merchantsList.map(merchant => (
            <div 
              key={merchant.id} 
              className="bg-card border border-border/50 rounded-[2rem] p-5 shadow-sm overflow-hidden relative group"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-border/40 shadow-sm">
                  <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground truncate">{merchant.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
                      {merchant.category}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      • {merchant.neighborhood}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${merchant.promotion.isActive ? 'bg-whatsapp animate-pulse' : 'bg-muted'}`} />
                  <span className="text-[11px] font-bold text-foreground">
                    Promoção: {merchant.promotion.isActive ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                <button 
                  onClick={() => togglePromotion(merchant.id)}
                  className={`p-2 rounded-xl transition-all ${merchant.promotion.isActive ? 'bg-whatsapp/10 text-whatsapp' : 'bg-secondary text-muted-foreground'}`}
                >
                  <Power className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button 
                  asChild
                  variant="outline" 
                  className="rounded-xl h-10 text-[11px] font-black border-border/60 flex items-center gap-2"
                >
                  <Link to="/negocios/$id" params={{ id: merchant.id }}>
                    <Eye className="h-3.5 w-3.5" />
                    Ver página
                  </Link>
                </Button>
                <Button 
                  variant="secondary" 
                  className="rounded-xl h-10 text-[11px] font-black flex items-center gap-2"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Status Dashboard Summary */}
        <section className="mt-10 p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Seu Desempenho</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-2xl border border-border/40">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Visitas</p>
              <p className="text-2xl font-black text-foreground">142</p>
            </div>
            <div className="bg-card p-4 rounded-2xl border border-border/40">
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Cliques Whats</p>
              <p className="text-2xl font-black text-foreground">28</p>
            </div>
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
            Ver estatísticas completas
            <ChevronRight className="h-3 w-3" />
          </button>
        </section>
      </main>
    </div>
  );
}