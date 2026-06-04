import { Home, Search, PlusCircle, Car, Wrench, Newspaper } from "lucide-react";
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
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-[2rem] px-2 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-1 z-50 md:hidden w-[90%] max-w-[400px] justify-around">
      <Link 
        to="/" 
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive('/') ? 'text-orange-600 bg-orange-50' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Home className={`w-5 h-5 ${isActive('/') ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-black uppercase tracking-tighter">Início</span>
      </Link>
      
      <Link 
        to="/negocios" 
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive('/negocios') ? 'text-orange-600 bg-orange-50' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Search className={`w-5 h-5 ${isActive('/negocios') ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-black uppercase tracking-tighter">Lojas</span>
      </Link>

      <Link 
        to="/servicos" 
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive('/servicos') ? 'text-orange-600 bg-orange-50' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Wrench className={`w-5 h-5 ${isActive('/servicos') ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-black uppercase tracking-tighter">Jobs</span>
      </Link>

      <Link 
        to="/transporte" 
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive('/transporte') ? 'text-orange-600 bg-orange-50' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Car className={`w-5 h-5 ${isActive('/transporte') ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-black uppercase tracking-tighter">Rides</span>
      </Link>
      
      <Link 
        to="/noticias" 
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive('/noticias') ? 'text-orange-600 bg-orange-50' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Newspaper className={`w-5 h-5 ${isActive('/noticias') ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-black uppercase tracking-tighter">News</span>
      </Link>

      <Link 
        to="/anuncie" 
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive('/anuncie') ? 'text-orange-600 bg-orange-50' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <PlusCircle className={`w-5 h-5 ${isActive('/anuncie') ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-black uppercase tracking-tighter">Anunciar</span>
      </Link>

    </nav>
  );
});