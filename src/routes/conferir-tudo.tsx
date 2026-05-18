import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search, Filter, Share2 } from "lucide-react";
import { mockWidgets } from "@/data/neighborhood";
import { WidgetCard } from "@/components/WidgetCard";

export const Route = createFileRoute("/conferir-tudo")({
  component: SeeAll,
});

function SeeAll() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="px-6 pt-10 pb-6 bg-card border-b border-border flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate({ to: "/" })} className="p-2 hover:bg-secondary rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold flex-1">Meu Bairro Agora</h1>
        <button className="p-2 hover:bg-secondary rounded-full">
          <Share2 className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>

      <main className="p-6">
        <div className="flex gap-2 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Filtrar widgets..."
              className="w-full bg-card border border-border/50 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-primary transition-all"
            />
          </div>
          <button className="p-3 bg-card border border-border/50 rounded-2xl">
            <Filter className="h-5 w-5 text-primary" />
          </button>
        </div>

        <section className="space-y-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 px-1">Essenciais</h2>
            <div className="grid grid-cols-2 gap-4">
              {mockWidgets.slice(0, 4).map(widget => (
                <WidgetCard key={widget.id} widget={widget} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 px-1">Comunidade e Humor</h2>
            <div className="grid grid-cols-2 gap-4">
              {mockWidgets.slice(4).map(widget => (
                <WidgetCard key={widget.id} widget={widget} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
