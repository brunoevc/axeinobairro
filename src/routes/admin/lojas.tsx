import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { 
  Settings, 
  Eye, 
  Edit3, 
  Power,
  ChevronRight,
  Plus,
  Store
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
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-foreground">Minhas Lojas</h1>
        <p className="text-muted-foreground font-medium text-sm">
          Gerencie seus anúncios e promoções ativas no bairro.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 flex justify-between items-center mb-2">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Store className="h-4 w-4" />
            Lojas Cadastradas
          </h2>
          <Button asChild size="sm" className="rounded-xl font-bold gap-1 text-[11px] h-9">
            <Link to="/cadastro">
              <Plus className="h-4 w-4" />
              Nova Loja
            </Link>
          </Button>
        </div>

        {merchantsList.map(merchant => (
          <div 
            key={merchant.id} 
            className="bg-card border border-border/50 rounded-[2.5rem] p-6 shadow-sm overflow-hidden relative group"
          >
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shrink-0 border border-border/40 shadow-md">
                <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-foreground truncate">{merchant.name}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-secondary text-muted-foreground">
                    {merchant.category}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    • {merchant.neighborhood}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${merchant.promotion.isActive ? 'bg-whatsapp animate-pulse shadow-[0_0_10px_oklch(0.65_0.17_150_/_0.5)]' : 'bg-muted'}`} />
                <div>
                  <p className="text-[11px] font-black text-foreground uppercase tracking-tight">Status Promoção</p>
                  <p className={`text-xs font-bold ${merchant.promotion.isActive ? 'text-whatsapp' : 'text-muted-foreground'}`}>
                    {merchant.promotion.isActive ? 'Publicada e Ativa' : 'Pausada'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => togglePromotion(merchant.id)}
                className={`p-3 rounded-2xl transition-all shadow-sm ${merchant.promotion.isActive ? 'bg-whatsapp/10 text-whatsapp' : 'bg-secondary text-muted-foreground'}`}
              >
                <Power className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button 
                asChild
                variant="outline" 
                className="rounded-2xl h-12 text-xs font-black border-border/60 flex items-center gap-2 bg-card hover:bg-secondary/50"
              >
                <Link to="/negocios/$id" params={{ id: merchant.id }}>
                  <Eye className="h-4 w-4" />
                  Página Pública
                </Link>
              </Button>
              <Button 
                variant="secondary" 
                className="rounded-2xl h-12 text-xs font-black flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Editar Dados
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <section className="mt-4 p-8 bg-primary/5 rounded-[3rem] border border-primary/10">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">Desempenho nos últimos 30 dias</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-[2rem] border border-border/40 shadow-sm">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Visitas Únicas</p>
            <p className="text-3xl font-black text-foreground">1.402</p>
            <p className="text-[10px] text-whatsapp font-bold mt-2">+12% vs mês anterior</p>
          </div>
          <div className="bg-card p-6 rounded-[2rem] border border-border/40 shadow-sm">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Contatos WhatsApp</p>
            <p className="text-3xl font-black text-foreground">84</p>
            <p className="text-[10px] text-whatsapp font-bold mt-2">+5% vs mês anterior</p>
          </div>
          <div className="bg-card p-6 rounded-[2rem] border border-border/40 shadow-sm">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Cliques Instagram</p>
            <p className="text-3xl font-black text-foreground">56</p>
            <p className="text-[10px] text-muted-foreground font-bold mt-2">Sem alteração</p>
          </div>
        </div>
        <button className="w-full mt-8 py-3 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary hover:underline transition-all">
          Gerar Relatório Completo (PDF)
          <ChevronRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  );
}