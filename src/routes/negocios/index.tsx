import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MapPin, 
  LayoutGrid,
  X,
  PlusCircle,
  Settings2,
  ChevronDown,
  Navigation,
  RefreshCw
} from "lucide-react";
import { merchants, categories, neighborhoods } from "@/data/merchants";
import { MerchantCard } from "@/components/MerchantCard";
import { MerchantSkeleton } from "@/components/MerchantSkeleton";
import { z } from "zod";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Button } from "@/components/ui/button";
import { useLocation } from "@/hooks/useLocation";

const searchSchema = z.object({
  categoria: z.string().optional(),
  bairro: z.string().optional(),
  q: z.string().optional(),
  hasPromotion: z.boolean().optional(),
});

export const Route = createFileRoute("/negocios/")({
  validateSearch: (search) => searchSchema.parse(search),
  component: ListingPage,
});

function ListingPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const [searchTerm, setSearchTerm] = useState(searchParams.q || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.categoria || "all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(searchParams.bairro || "all");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Synchronize internal state when URL parameters change (e.g. back/forward button)
  useEffect(() => {
    setSearchTerm(searchParams.q || "");
    setSelectedCategory(searchParams.categoria || "all");
    setSelectedNeighborhood(searchParams.bairro || "all");
  }, [searchParams.q, searchParams.categoria, searchParams.bairro]);

  // Update URL search parameters when local filters change
  const updateFilters = (newFilters: { q?: string; categoria?: string; bairro?: string }) => {
    const nextSearch = { ...searchParams };
    
    if (newFilters.q !== undefined) {
      if (newFilters.q) nextSearch.q = newFilters.q;
      else delete nextSearch.q;
    }
    
    if (newFilters.categoria !== undefined) {
      if (newFilters.categoria !== 'all') nextSearch.categoria = newFilters.categoria;
      else delete nextSearch.categoria;
    }
    
    if (newFilters.bairro !== undefined) {
      if (newFilters.bairro !== 'all') nextSearch.bairro = newFilters.bairro;
      else delete nextSearch.bairro;
    }

    navigate({ to: '/negocios', search: nextSearch, replace: true });
  };

  const { coords, getDistance, loading: locationLoading } = useLocation();

  useEffect(() => {
    // Simulate a brief loading for a more "premium" feel with skeletons
    const timer = setTimeout(() => setIsInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredMerchants = useMemo(() => {
    let list = [...merchants];
    
    // Calculate distance and sort if coordinates are available
    if (coords) {
      list = list.map(m => ({
        ...m,
        calculatedDistance: getDistance(coords.latitude, coords.longitude, m.latitude, m.longitude)
      }))
      .sort((a, b) => (a as any).calculatedDistance - (b as any).calculatedDistance);
    }

    const searchKeywords = searchTerm.toLowerCase().trim().split(/\s+/).filter((k: string) => k.length > 0);

    return list.filter(merchant => {
      const merchantText = `${merchant.name} ${merchant.description} ${merchant.category} ${merchant.neighborhood}`.toLowerCase();
      
      const matchesSearch = searchKeywords.length === 0 || 
                           searchKeywords.every((keyword: string) => merchantText.includes(keyword));

      const matchesCategory = selectedCategory === "all" || merchant.category === selectedCategory;
      const matchesNeighborhood = selectedNeighborhood === "all" || merchant.neighborhood === selectedNeighborhood;
      const matchesPromotion = !searchParams.hasPromotion || merchant.promotion.isActive;
      
      return matchesSearch && matchesCategory && matchesNeighborhood && matchesPromotion;
    });
  }, [searchTerm, selectedCategory, selectedNeighborhood, searchParams.hasPromotion, coords, getDistance]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedNeighborhood("all");
    navigate({ to: '/negocios', search: {}, replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <TopBar />
      
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                 <button 
                  onClick={() => navigate({ to: "/" })} 
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                 >
                   <ArrowLeft className="h-5 w-5" />
                 </button>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Negócios em Araruama</h1>
               </div>
               <p className="text-slate-500 font-medium ml-12">
                 {filteredMerchants.length} estabelecimentos em {selectedNeighborhood === 'all' ? 'toda a cidade' : selectedNeighborhood}
               </p>
            </div>

            <Button 
              onClick={() => navigate({ to: '/cadastro' })}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl h-12 px-6 font-black shadow-lg shadow-orange-100 active:scale-95 transition-all self-start md:self-auto"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Anunciar meu negócio
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Pesquisar por nome ou serviço..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 focus:bg-white transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchTerm(val);
                  updateFilters({ q: val });
                }}
              />
              {searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    updateFilters({ q: "" });
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200/50 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="h-3 w-3 text-slate-500" />
                </button>
              )}
            </div>

            <div className="md:col-span-3 relative">
               <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-600 pointer-events-none" />
               <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-10 pr-10 text-xs font-black uppercase tracking-wider outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 focus:bg-white appearance-none cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                value={selectedNeighborhood}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedNeighborhood(val);
                  updateFilters({ bairro: val });
                }}
              >
                <option value="all">Todos os Bairros</option>
                {neighborhoods.map(hood => (
                  <option key={hood} value={hood}>{hood}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="md:col-span-3 relative">
               <Settings2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-600 pointer-events-none" />
               <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-10 pr-10 text-xs font-black uppercase tracking-wider outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 focus:bg-white appearance-none cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                value={selectedCategory}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCategory(val);
                  updateFilters({ categoria: val });
                }}
              >
                <option value="all">Todas Categorias</option>
                {categories.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {(searchTerm || selectedCategory !== "all" || selectedNeighborhood !== "all" || searchParams.hasPromotion) && (
            <div className="mt-6 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-2">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filtros ativos:</span>
               
               {selectedCategory !== 'all' && (
                  <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border border-orange-100">
                    {categories.find(c => c.slug === selectedCategory)?.label}
                    <button onClick={() => {
                      setSelectedCategory('all');
                      updateFilters({ categoria: 'all' });
                    }}><X className="w-3 h-3" /></button>
                 </div>
               )}

               {selectedNeighborhood !== 'all' && (
                 <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border border-orange-100">
                    {selectedNeighborhood}
                    <button onClick={() => {
                      setSelectedNeighborhood('all');
                      updateFilters({ bairro: 'all' });
                    }}><X className="w-3 h-3" /></button>
                 </div>
               )}

               {searchParams.hasPromotion && (
                 <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border border-orange-100">
                    Com Promoção
                    <button onClick={() => navigate({ to: '/negocios', search: { ...searchParams, hasPromotion: undefined }, replace: true })}><X className="w-3 h-3" /></button>
                 </div>
               )}

               <button 
                onClick={clearFilters}
                className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest underline underline-offset-4 decoration-slate-200 hover:decoration-red-200 transition-all"
               >
                Limpar filtros
               </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {filteredMerchants.length} {filteredMerchants.length === 1 ? 'resultado' : 'resultados'} encontrados
          </p>
          {coords && (
             <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-xl border border-orange-100 shadow-sm animate-in fade-in slide-in-from-right-4">
                <Navigation className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Ordenado por proximidade</span>
             </div>
          )}
        </div>

        {isInitialLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <MerchantSkeleton key={i} />
            ))}
          </div>
        ) : filteredMerchants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMerchants.map(merchant => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
              <Search className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Ops! Nenhum negócio encontrado</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
              Não encontramos resultados para sua busca. Experimente mudar os termos ou remover os filtros.
            </p>
            <Button 
              onClick={clearFilters}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-orange-200 active:scale-95 transition-all"
            >
              Ver todos os negócios
            </Button>
          </div>
        )}
      </main>

      <FloatingNav />
    </div>
  );
}
