import { useState, useMemo, useEffect, useCallback, memo } from "react";
import { MapPin, Search, RefreshCw, AlertCircle, ChevronDown, X, History, Lock, Sparkles } from "lucide-react";

import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/ui/Logo";
import { useLocation } from "@/hooks/useLocation";
import { neighborhoods } from "@/data/merchants";
import { Button } from "@/components/ui/button";
import { DigitalClock, DigitalDate } from "./DigitalClock";

const IS_ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === 'true';


const RECENT_NEIGHBORHOODS_KEY = "axei_recent_neighborhoods";

export const TopBar = memo(function TopBar() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [neighborhoodSearch, setNeighborhoodSearch] = useState("");
  const [recentNeighborhoods, setRecentNeighborhoods] = useState<string[]>([]);
  const [isCompact, setIsCompact] = useState(false);
  
  const navigate = useNavigate();
  const { locationName, loading, error, retry, setManualLocation } = useLocation();

  // Load recent neighborhoods
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_NEIGHBORHOODS_KEY);
    if (stored) {
      try {
        setRecentNeighborhoods(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recent neighborhoods", e);
      }
    }
  }, []);

  // Track scroll for compact mode on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        setIsCompact(window.scrollY > 60);
      } else {
        setIsCompact(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleManualSelect = useCallback((neighborhood: string) => {
    setManualLocation(neighborhood, "Araruama/RJ");
    
    // Update recents
    setRecentNeighborhoods(prev => {
      const filtered = prev.filter(n => n !== neighborhood);
      const updated = [neighborhood, ...filtered].slice(0, 5);
      localStorage.setItem(RECENT_NEIGHBORHOODS_KEY, JSON.stringify(updated));
      return updated;
    });

    setIsLocationModalOpen(false);
    setNeighborhoodSearch("");
  }, [setManualLocation]);

  const filteredNeighborhoods = useMemo(() => {
    if (!neighborhoodSearch.trim()) return neighborhoods;
    const search = neighborhoodSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return neighborhoods.filter(hood => 
      hood.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(search)
    );
  }, [neighborhoodSearch]);

  const groupedNeighborhoods = useMemo(() => {
    const groups: Record<string, string[]> = {};
    filteredNeighborhoods.sort().forEach(hood => {
      const firstLetter = hood.charAt(0).toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(hood);
    });
    return groups;
  }, [filteredNeighborhoods]);

  return (
    <div className={`w-full bg-white border-b border-slate-100 sticky top-0 z-50 transition-all duration-300 ${isCompact ? 'shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper Row: Utility Info (Desktop/Tablet) */}
        {!isCompact && (
          <div className="hidden md:flex justify-between items-center py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider border-b border-slate-50">
            <div className="flex items-center gap-6">
              <DigitalClock />
              <div 
                className={`flex items-center gap-1.5 group cursor-pointer transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`} 
                onClick={() => setIsLocationModalOpen(true)}
              >
                <MapPin className="w-3 h-3 text-orange-500" />
                {loading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin text-orange-500" />
                    <span className="animate-pulse">Buscando...</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-1 hover:text-orange-600 transition-colors">
                    {locationName}
                    <ChevronDown className="w-2.5 h-2.5" />
                    {error && <AlertCircle className="w-2.5 h-2.5 text-red-500" />}
                  </span>
                )}
              </div>
            </div>
            <DigitalDate />
          </div>
        )}

        {/* Lower Row: Main Nav */}
        <div className={`flex justify-between items-center transition-all duration-300 ${isCompact ? 'h-14' : 'h-16 md:h-20'}`}>
          <div className="flex items-center gap-8">
            <Link to="/" className={`flex items-center transition-all duration-300 ${isCompact ? 'scale-90 origin-left' : ''}`}>
              <Logo />
            </Link>
            
            {!isCompact && (
              <nav className="hidden lg:flex items-center gap-6">
                <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Início</Link>
                <Link to="/como-funciona" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Como Funciona</Link>
                <Link to="/negocios" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Lojas</Link>
                <Link to="/servicos" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Serviços</Link>
                <Link to="/transporte" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Transporte</Link>
                <Link to="/recomendacoes" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Dicas</Link>
                <Link to="/feedback" className="text-sm font-bold text-violet-600 hover:text-violet-700 transition-all flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 rounded-xl">
                  <Sparkles className="w-3.5 h-3.5" />
                  Feedback
                </Link>
                <Link to="/anuncie" className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors px-4 py-2 bg-orange-50 rounded-xl">Anuncie</Link>


                <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
                  <Link 
                    to={localStorage.getItem("axei_auth_status") === "true" ? "/painel" : "/login"} 
                    className="text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors"
                  >
                    {localStorage.getItem("axei_auth_status") === "true" ? "Meu Painel" : "Entrar"}
                  </Link>
                </div>


              </nav>
            )}
          </div>

          <div className={`flex-1 max-w-sm mx-8 hidden md:block ${isCompact ? 'max-w-xs' : ''}`}>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="text" 
                placeholder="O que você procura hoje?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value;
                    navigate({ to: '/negocios', search: { q: value } });
                  }
                }}
              />
            </div>
          </div>

          {/* Mobile Location Header */}
          <div className={`md:hidden flex flex-col items-end cursor-pointer transition-all ${isCompact ? 'scale-95' : ''}`} onClick={() => setIsLocationModalOpen(true)}>
             <div className="flex items-center gap-1 text-[10px] font-black text-orange-600 uppercase leading-none">
                <MapPin className="w-3 h-3" />
                 {loading ? 'Buscando...' : locationName.split(' - ')[0]}
                 <ChevronDown className="w-2.5 h-2.5" />
             </div>
             {!isCompact && (
               <div className="text-[10px] text-slate-400 mt-0.5">
                 <DigitalClock showIcon={false} />
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Manual Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsLocationModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Escolha seu Bairro</h3>
                <p className="text-[10px] font-black text-orange-600 mt-1 uppercase tracking-widest">Araruama - RJ</p>
              </div>
              <button onClick={() => setIsLocationModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="p-4 border-b border-slate-50">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar bairro..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all"
                  value={neighborhoodSearch}
                  onChange={(e) => setNeighborhoodSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="p-0 max-h-[50vh] overflow-y-auto">
              {/* Recent Neighborhoods */}
              {!neighborhoodSearch && recentNeighborhoods.length > 0 && (
                <div className="p-4 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <History className="w-3 h-3" /> Recentes
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentNeighborhoods.map(hood => (
                      <button
                        key={hood}
                        onClick={() => handleManualSelect(hood)}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm"
                      >
                        {hood}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => { retry(); setIsLocationModalOpen(false); }}
                className="w-full flex items-center gap-3 p-4 hover:bg-orange-50 transition-colors group border-b border-slate-50"
              >
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-900 italic">Usar localização atual</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ativar GPS do dispositivo</p>
                </div>
              </button>
              
              <div className="py-2">
                {Object.keys(groupedNeighborhoods).sort().map(letter => (
                  <div key={letter} className="mb-2">
                    <div className="px-6 py-1 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-y border-slate-50/50">
                      {letter}
                    </div>
                    {groupedNeighborhoods[letter].map(hood => (
                      <button 
                        key={hood}
                        onClick={() => handleManualSelect(hood)}
                        className="w-full text-left px-6 py-3 hover:bg-orange-50 text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors flex items-center justify-between group"
                      >
                        {hood}
                        <ChevronDown className="w-4 h-4 opacity-0 -rotate-90 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                ))}
                {filteredNeighborhoods.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase">Nenhum bairro encontrado</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <Button 
                onClick={() => setIsLocationModalOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl h-12 shadow-lg"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});