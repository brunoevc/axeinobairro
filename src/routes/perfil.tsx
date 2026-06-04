import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { ArrowLeft, User, MapPin, Bell, Shield, Settings, ChevronRight, Store, Sparkles, ChevronLeft, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Logo } from "@/components/ui/Logo";
import { useAtom } from "jotai";
import { isAuthenticatedAtom, authUserAtom } from "@/hooks/useAuth";
import { toast } from "sonner";
import React from "react";

export const Route = createFileRoute("/perfil")({
  beforeLoad: () => {
    const authStatus = localStorage.getItem("axei_auth_status");
    if (authStatus !== "true") {
       throw redirect({ to: '/login' });
    }
  },
  component: Profile,
});


function Profile() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [name, setName] = useState(authUser?.name || "Morador do Bairro");

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthUser(null);
    toast.success("Você saiu com sucesso.");
    navigate({ to: "/" });
  };


  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <TopBar />
      
      <header className="relative bg-white border-b border-slate-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-60" />
        
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <button 
            onClick={() => navigate({ to: "/" })}
            className="mb-8 p-3 bg-slate-50 rounded-full border border-slate-100 hover:bg-white hover:shadow-md transition-all active:scale-90 inline-flex group"
          >
            <ChevronLeft className="h-5 w-5 text-slate-400 group-hover:text-orange-600" />
          </button>
          
          <div className="flex items-center gap-8">
            <Logo iconOnly className="scale-150 origin-left ml-4" />
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{name}</h1>
              <div className="flex items-center gap-3 mt-3">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 rounded-full border border-orange-100">
                    <MapPin className="h-3.5 w-3.5 text-orange-600" />
                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Vila Nova, RJ</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
             <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Dados da Conta</h2>
             <span className="text-[10px] font-bold text-orange-600 underline">Editar</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            {[
              { icon: User, label: "Nome Completo", value: name },
              { icon: MapPin, label: "Bairro Principal", value: "Vila Nova" },
              { icon: Sparkles, label: "Meus Favoritos", value: "8 Negócios" }
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-6 hover:bg-slate-50 transition-colors cursor-pointer ${i !== 2 ? 'border-b border-slate-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
                     <item.icon className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="font-bold text-slate-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                  {item.value}
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Store className="h-8 w-8 text-violet-400" />
               </div>
               <h3 className="text-2xl font-black mb-2 tracking-tighter leading-tight">Você tem um negócio local?</h3>
               <p className="text-slate-400 font-medium mb-8 max-w-sm">
                 Anuncie no Axêi no Bairro e conecte-se diretamente com moradores da sua região via WhatsApp.
               </p>
               <div className="flex flex-col sm:flex-row w-full gap-4">
                 <button 
                   onClick={() => navigate({ to: '/cadastro' })}
                   className="flex-1 py-5 bg-orange-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-900/40 active:scale-95 transition-all"
                 >
                   Cadastrar minha Loja
                 </button>
                 <button 
                   onClick={() => navigate({ to: '/admin/lojas' })}
                   className="flex-1 py-5 bg-white/5 border border-white/10 text-white font-black text-sm rounded-2xl hover:bg-white/10 active:scale-95 transition-all"
                 >
                   Painel do Lojista
                 </button>
               </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6 px-2">
             <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Configurações</h2>
          </div>
          <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            {[
              { icon: Bell, label: "Notificações de Ofertas", value: "Sempre" },
              { icon: Shield, label: "Privacidade e Segurança", value: "" },
              { icon: Settings, label: "Preferências de Exibição", value: "Padrão" }
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-6 hover:bg-slate-50 transition-colors cursor-pointer ${i !== 2 ? 'border-b border-slate-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
                     <item.icon className="h-5 w-5 text-slate-400" />
                  </div>
                  <span className="font-bold text-slate-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                  {item.value}
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <div className="pt-4 flex justify-center">
           <button 
            onClick={handleLogout}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 hover:text-red-600 transition-colors flex items-center gap-2"
           >
             <LogOut className="w-3 h-3" />
             Sair da Conta
           </button>
        </div>

      </main>

      <FloatingNav />
    </div>
  );
}
