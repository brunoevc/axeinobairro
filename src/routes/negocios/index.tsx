import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useCallback } from "react";
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
  RefreshCw,
  Briefcase,
  Car
} from "lucide-react";
import { categories, neighborhoods } from "@/data/merchants";
import { merchantsRepository } from "@/repositories/merchantsRepository";
import { localBoostsRepository } from "@/repositories/localBoostsRepository";
import { MerchantCard } from "@/components/MerchantCard";
import { MerchantSkeleton } from "@/components/MerchantSkeleton";
import { ListingSkeleton } from "@/components/ListingSkeleton";
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
  const [isFiltering, setIsFiltering] = useState(false);

  // Helper function to normalize strings for search (remove accents)
  const normalizeString = useCallback((str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }, []);

  // Synchronize internal state when URL parameters change (e.g. back/forward button)
  useEffect(() => {
    if (searchParams.q !== undefined && searchParams.q !== searchTerm) {
      setSearchTerm(searchParams.q || "");
    }
    if (searchParams.categoria !== undefined && searchParams.categoria !== (selectedCategory === "all" ? undefined : selectedCategory)) {
      setSelectedCategory(searchParams.categoria || "all");
    }
    if (searchParams.bairro !== undefined && searchParams.bairro !== (selectedNeighborhood === "all" ? undefined : selectedNeighborhood)) {
      setSelectedNeighborhood(searchParams.bairro || "all");
    }
  }, [searchParams.q, searchParams.categoria, searchParams.bairro]);

  // Debounced filter update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = { ...searchParams };
      let changed = false;

      const qVal = searchTerm || undefined;
      if (nextSearch.q !== qVal) {
        if (qVal) nextSearch.q = qVal;
        else delete nextSearch.q;
        changed = true;
      }

      const catVal = selectedCategory !== 'all' ? selectedCategory : undefined;
      if (nextSearch.categoria !== catVal) {
        if (catVal) nextSearch.categoria = catVal;
        else delete nextSearch.categoria;
        changed = true;
      }

      const neighborhoodVal = selectedNeighborhood !== 'all' ? selectedNeighborhood : undefined;
      if (nextSearch.bairro !== neighborhoodVal) {
        if (neighborhoodVal) nextSearch.bairro = neighborhoodVal;
        else delete nextSearch.bairro;
        changed = true;
      }

      if (changed) {
        setIsFiltering(true);
        navigate({ to: '/negocios', search: nextSearch, replace: true });
        setTimeout(() => setIsFiltering(false), 300);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedNeighborhood]);

  const { coords, getDistance, loading: locationLoading } = useLocation();

  // If location is loading and we have no coords, we want to show a skeleton state
  // This is handled by isInitialLoading OR locationLoading if it's the first time
  const showSkeletons = isInitialLoading || (locationLoading && !coords) || isFiltering;

  useEffect(() => {
    // Simulate a brief loading for a more "premium" feel with skeletons
    const timer = setTimeout(() => setIsInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);


  const filteredMerchants = useMemo(() => {
    let list = merchantsRepository.getAll();
    
    // Apply filters first
    const searchKeywords = normalizeString(searchTerm).split(/\s+/).filter((k: string) => k.length > 0);

    list = list.filter(merchant => {
      const categoryLabel = categories.find(c => c.slug === merchant.category)?.label || "";
      const searchableFields = [
        merchant.name,
        merchant.description,
        merchant.category,
        categoryLabel,
        merchant.neighborhood
      ];
      const merchantText = searchableFields.map(field => normalizeString(field || "")).join(" ");
      
      const matchesSearch = searchKeywords.length === 0 || 
                           searchKeywords.every((keyword: string) => merchantText.includes(keyword));

      const matchesCategory = selectedCategory === "all" || 
                               normalizeString(merchant.category) === normalizeString(selectedCategory);
      const matchesNeighborhood = selectedNeighborhood === "all" || 
                                  normalizeString(merchant.neighborhood) === normalizeString(selectedNeighborhood);
      const matchesPromotion = !searchParams.hasPromotion || merchant.promotion.isActive;
      
      return matchesSearch && matchesCategory && matchesNeighborhood && matchesPromotion;
    });

    // Apply Boosts (Priority)
    list = localBoostsRepository.sortByBoost(list, 'loja', 'id');

    // Calculate distance and sort by distance only for items within same boost level?
    // User asked to apply sortByBoost. Usually boosts override distance.
    if (coords) {
      list = list.map(m => ({
        ...m,
        calculatedDistance: getDistance(coords.latitude, coords.longitude, m.latitude, m.longitude)
      }));
      // If we want distance to be secondary:
      // list.sort((a, b) => (a as any).calculatedDistance - (b as any).calculatedDistance);
      // But sortByBoost already sorted them. Let's keep boost as primary.
    }

    return list;
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
                  setSearchTerm(e.target.value);
                }}
              />
              {searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm("");
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
                  setSelectedNeighborhood(e.target.value);
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
                  setSelectedCategory(e.target.value);
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
                    }}><X className="w-3 h-3" /></button>
                 </div>
               )}

               {selectedNeighborhood !== 'all' && (
                 <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border border-orange-100">
                    {selectedNeighborhood}
                    <button onClick={() => {
                      setSelectedNeighborhood('all');
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
          <div className="flex flex-col gap-1">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {filteredMerchants.length} {filteredMerchants.length === 1 ? 'resultado' : 'resultados'} encontrados
            </p>
            {locationLoading && coords && (
              <div className="flex items-center gap-2 text-orange-500 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest">Atualizando localização...</span>
              </div>
            )}
          </div>
          {coords && (
             <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-xl border border-orange-100 shadow-sm animate-in fade-in slide-in-from-right-4">
                <Navigation className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Ordenado por proximidade</span>
             </div>
          )}
        </div>

        {showSkeletons ? (
          <div className="col-span-full">
            <ListingSkeleton count={8} />
          </div>
        ) : filteredMerchants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMerchants.map(merchant => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm px-6">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 border border-orange-100">
              <Search className="h-10 w-10 text-orange-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Ops! Nenhum negócio encontrado</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
              Não encontramos resultados para sua busca ou para os filtros aplicados no momento.
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
