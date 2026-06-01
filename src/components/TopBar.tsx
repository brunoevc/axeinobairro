import { useState, useEffect } from "react";
import { Clock, CloudSun, MapPin, Search } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

export function TopBar() {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState("Vila Nova - Barra Mansa/RJ");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("Location access granted", position.coords);
      }, (error) => {
        console.log("Location access denied", error);
      });
    }

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper Row: Utility Info (Desktop/Tablet) */}
        <div className="hidden md:flex justify-between items-center py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider border-b border-slate-50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-violet-500" />
              {time.toLocaleTimeString('pt-BR')}
            </div>
            <div className="flex items-center gap-1.5">
              <CloudSun className="w-3 h-3 text-violet-500" />
              28°C Parcialmente nublado
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-violet-500" />
              {location}
            </div>
          </div>
          <div>{time.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        {/* Lower Row: Main Nav */}
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">
                Axêi no <span className="text-violet-600">Bairro</span>
              </span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors">Início</Link>
              <Link to="/negocios" className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors">Negócios</Link>
              <Link to="/cadastro" className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors">Cadastro</Link>
              <Link to="/admin" className="text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors">Admin</Link>
            </nav>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
              <input 
                type="text" 
                placeholder="O que você procura hoje?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate({ to: '/negocios', search: { q: (e.target as HTMLInputElement).value } });
                  }
                }}
              />
            </div>
          </div>

          {/* Mobile Location Header */}
          <div className="flex md:hidden flex-col items-end">
             <div className="flex items-center gap-1 text-[10px] font-bold text-violet-600 uppercase">
                <MapPin className="w-3 h-3" />
                {location.split(' - ')[0]}
             </div>
             <div className="text-[10px] text-slate-400">{time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
