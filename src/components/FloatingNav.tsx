import { Home, Search, PlusCircle, Car, Wrench } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { memo } from "react";

export const FloatingNav = memo(function FloatingNav() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-lg border border-slate-200/50 rounded-full px-4 py-2 shadow-2xl flex items-center gap-8 z-50 md:hidden">
      <Link 
        to="/" 
        className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive('/') ? 'text-orange-600 scale-110' : 'text-slate-400'}`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold">Início</span>
      </Link>
      
      <Link 
        to="/negocios" 
        className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive('/negocios') ? 'text-orange-600 scale-110' : 'text-slate-400'}`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-bold">Buscar</span>
      </Link>
      
      <Link 
        to="/noticias" 
        className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive('/noticias') ? 'text-orange-600 scale-110' : 'text-slate-400'}`}
      >
        <span className="text-[10px] font-bold">News</span>
      </Link>

      <Link 
        to="/servicos" 
        className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive('/servicos') ? 'text-orange-600 scale-110' : 'text-slate-400'}`}
      >
        <Wrench className="w-5 h-5" />
        <span className="text-[10px] font-bold">Serviços</span>
      </Link>

      <Link 
        to="/transporte" 

        className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive('/transporte') ? 'text-orange-600 scale-110' : 'text-slate-400'}`}
      >
        <Car className="w-5 h-5" />
        <span className="text-[10px] font-bold">Rides</span>
      </Link>

      <Link 
        to="/cadastro" 
        className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive('/cadastro') ? 'text-orange-600 scale-110' : 'text-slate-400'}`}
      >
        <PlusCircle className="w-5 h-5" />
        <span className="text-[10px] font-bold">Anunciar</span>
      </Link>

    </nav>
  );
});
