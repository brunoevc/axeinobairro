import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MapPin, 
  LayoutGrid,
  X
} from "lucide-react";
import { merchants, categories, neighborhoods } from "@/data/merchants";
import { MerchantCard } from "@/components/MerchantCard";
import { z } from "zod";

const searchSchema = z.object({
  category: z.string().optional(),
  neighborhood: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/negocios/")({
  validateSearch: (search) => searchSchema.parse(search),
  component: ListingPage,
});

function ListingPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const [searchTerm, setSearchTerm] = useState(searchParams.q || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || "all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(searchParams.neighborhood || "all");

  const filteredMerchants = useMemo(() => {
    return merchants.filter(merchant => {
      const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           merchant.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || merchant.category === selectedCategory;
      const matchesNeighborhood = selectedNeighborhood === "all" || merchant.neighborhood === selectedNeighborhood;
      
      return matchesSearch && matchesCategory && matchesNeighborhood;
    });
  }, [searchTerm, selectedCategory, selectedNeighborhood]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedNeighborhood("all");
    navigate({ to: '/negocios', search: {} });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-10 pb-6 bg-card border-b border-border/50 sticky top-0 z-30">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate({ to: "/" })} className="p-2.5 hover:bg-secondary rounded-full border border-border/40 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-black">Negócios do Bairro</h1>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Nome do comércio ou serviço..."
              className="w-full bg-secondary/40 border border-border/40 rounded-2xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-primary focus:bg-card transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex shrink-0 items-center gap-2 bg-secondary/50 rounded-xl px-3 border border-border/40">
              <Filter className="h-3 w-3 text-primary" />
              <select 
                className="bg-transparent text-xs font-bold py-2 outline-none appearance-none cursor-pointer pr-4"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas Categorias</option>
                {categories.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="flex shrink-0 items-center gap-2 bg-secondary/50 rounded-xl px-3 border border-border/40">
              <MapPin className="h-3 w-3 text-primary" />
              <select 
                className="bg-transparent text-xs font-bold py-2 outline-none appearance-none cursor-pointer pr-4"
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
              >
                <option value="all">Todos os Bairros</option>
                {neighborhoods.map(hood => (
                  <option key={hood} value={hood}>{hood}</option>
                ))}
              </select>
            </div>

            {(searchTerm || selectedCategory !== "all" || selectedNeighborhood !== "all") && (
              <button 
                onClick={clearFilters}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors"
              >
                <X className="h-3 w-3" />
                Limpar
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {filteredMerchants.length} {filteredMerchants.length === 1 ? 'resultado' : 'resultados'}
          </p>
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>

        {filteredMerchants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMerchants.map(merchant => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Nenhum negócio encontrado</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8 leading-relaxed">
              Não encontramos resultados para os filtros selecionados. Tente buscar por outros termos ou categorias.
            </p>
            <button 
              onClick={clearFilters}
              className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              Ver todos os negócios
            </button>
          </div>
        )}
      </main>

      {/* Footer Nav Integration */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-xl border border-border/40 rounded-full px-6 py-3 shadow-2xl flex items-center gap-10 z-50">
        <button onClick={() => navigate({ to: '/' })} className="text-muted-foreground hover:text-primary transition-colors flex flex-col items-center gap-0.5">
          <LayoutGrid className="h-5 w-5" />
          <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">Início</span>
        </button>
        <button onClick={() => navigate({ to: '/negocios' })} className="text-primary flex flex-col items-center gap-0.5">
          <Search className="h-5 w-5" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Buscar</span>
        </button>
        <button onClick={() => navigate({ to: '/cadastro' })} className="text-muted-foreground hover:text-primary transition-colors flex flex-col items-center gap-0.5">
          <PlusCircle className="h-5 w-5" />
          <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">Anunciar</span>
        </button>
      </nav>
    </div>
  );
}

// Add PlusCircle import
import { PlusCircle } from "lucide-react";
