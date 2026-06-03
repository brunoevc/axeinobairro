import { useState, memo } from "react";
import { MapPin, Search, RefreshCw, AlertCircle, ChevronDown, X } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/ui/Logo";
import { useLocation } from "@/hooks/useLocation";
import { neighborhoods } from "@/data/merchants";
import { Button } from "@/components/ui/button";
import { DigitalClock, DigitalDate } from "./DigitalClock";

export const TopBar = memo(function TopBar() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const navigate = useNavigate();
  const { locationName, loading, error, retry, setManualLocation } = useLocation();

  const handleManualSelect = (neighborhood: string) => {
    setManualLocation(neighborhood, "Araruama/RJ");
    setIsLocationModalOpen(false);
  };

  return (
    <div className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper Row: Utility Info (Desktop/Tablet) */}
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

        {/* Lower Row: Main Nav */}
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Início</Link>
              <Link to="/negocios" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Negócios</Link>
              <Link to="/servicos" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Serviços</Link>
              <Link to="/transporte" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Transporte</Link>
              <Link to="/noticias" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Notícias</Link>
              <Link to="/cadastro" className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors">Cadastro</Link>

            </nav>
          </div>

          <div className="flex-1 max-w-sm mx-8 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="text" 
                placeholder="O que você procura hoje?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all"
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
          <div className="md:hidden flex flex-col items-end cursor-pointer" onClick={() => setIsLocationModalOpen(true)}>
             <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 uppercase leading-none">
                <MapPin className="w-3 h-3" />
                 {loading ? 'Buscando...' : locationName.split(' - ')[0]}
                 <ChevronDown className="w-2.5 h-2.5" />
             </div>
             <div className="text-[10px] text-slate-400 mt-0.5">
               <DigitalClock showIcon={false} />
             </div>
          </div>
        </div>
      </div>

      {/* Manual Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsLocationModalOpen(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Alterar localização</h3>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Araruama - RJ</p>
              </div>
              <button onClick={() => setIsLocationModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <button 
                onClick={() => { retry(); setIsLocationModalOpen(false); }}
                className="w-full flex items-center gap-3 p-4 hover:bg-orange-50 rounded-2xl transition-colors group mb-2 border border-dashed border-slate-200 hover:border-orange-200"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-900">Usar minha localização</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ativar GPS do celular</p>
                </div>
              </button>
              
              <div className="grid grid-cols-1 gap-1">
                {neighborhoods.map(hood => (
                  <button 
                    key={hood}
                    onClick={() => handleManualSelect(hood)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors flex items-center justify-between group"
                  >
                    {hood}
                    <ChevronDown className="w-4 h-4 opacity-0 -rotate-90 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 bg-slate-50">
              <Button 
                onClick={() => setIsLocationModalOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl h-12"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
