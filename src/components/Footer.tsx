import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/ui/Logo";
import { Lock } from "lucide-react";

const IS_ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === 'true';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-20 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
          <Logo dark />
          <p className="text-slate-400 font-medium max-w-xs">
            O Ecossistema Digital da Comunidade. Conectando pessoas, negócios e oportunidades.
          </p>
          <div className="mt-4 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Uma solução Hubia Connect</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">CNPJ 27.807.284/0001-89</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
           <div className="flex flex-col gap-4 text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ecossistema</span>
              <Link to="/negocios" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Negócios Locais</Link>
              <Link to="/servicos" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Prestadores de Serviço</Link>
              <Link to="/transporte" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Transporte & Mobilidade</Link>
              <Link to="/comunidades" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Comunidades</Link>
              <Link to="/planos" className="text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors">Planos & Crescimento</Link>
           </div>
           <div className="flex flex-col gap-4 text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Institucional</span>
              <Link to="/como-funciona" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Como Funciona</Link>
              <Link to="/apoiadores" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Apoiadores</Link>
              <Link to="/representantes-programa" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Seja Representante</Link>
              <Link to="/noticias" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Notícias do Bairro</Link>
              {IS_ADMIN_ENABLED && (
                <Link to="/admin" className="text-sm font-bold text-slate-400 hover:text-orange-500 transition-colors flex items-center justify-center md:justify-start gap-1.5">
                  <Lock className="w-3 h-3" /> Admin
                </Link>
              )}
           </div>
           <div className="hidden sm:flex flex-col gap-4 text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contato</span>
              <a href="https://wa.me/5521999869070" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">WhatsApp Suporte</a>
              <span className="text-sm font-bold text-slate-300">Araruama / RJ</span>
           </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
         <span>© 2026 Axêi no Bairro. Todos os direitos reservados.</span>
         <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/axeinobairro" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="https://www.facebook.com/axeinobairro/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
            <a href="https://wa.me/5521999869070" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
         </div>
      </div>
    </footer>
  );
}
