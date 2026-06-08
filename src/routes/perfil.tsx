import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  ChevronRight, 
  Store, 
  Sparkles, 
  ChevronLeft, 
  LogOut,
  LayoutDashboard,
  Zap
} from "lucide-react";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import React from "react";

export const Route = createFileRoute("/perfil")({
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser, signOut, loading } = useAuth();
  const [name] = useState(authUser?.name || "Morador do Bairro");

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

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
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-3xl shadow-lg border-2 border-white">
               {name.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{name}</h1>
              <div className="flex items-center gap-3 mt-3">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 rounded-full border border-orange-100">
                    <MapPin className="h-3.5 w-3.5 text-orange-600" />
                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
                       {authUser ? authUser.role.replace('_', ' ') : "Morador"}
                    </span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        {isAuthenticated && (
           <section>
              <div className="bg-orange-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                      <LayoutDashboard className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-2xl font-black mb-2 tracking-tighter leading-tight">Painel de Controle</h3>
                   <p className="text-orange-100 font-medium mb-8 max-w-sm">
                     Acesse recursos exclusivos do seu perfil como {authUser?.role.replace('_', ' ')}.
                   </p>
                   <button 
                     onClick={() => navigate({ to: '/painel' })}
                     className="w-full py-5 bg-white text-orange-600 font-black text-sm rounded-2xl shadow-xl active:scale-95 transition-all"
                   >
                     Ir para Meu Painel
                   </button>
                </div>
              </div>
           </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6 px-2">
             <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Dados da Conta</h2>
             <span className="text-[10px] font-bold text-orange-600 underline cursor-pointer">Editar</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
            {[
              { icon: User, label: "Nome Completo", value: name },
              { icon: MapPin, label: "E-mail", value: authUser?.email || "Nenhum e-mail vinculado" },
              { icon: Sparkles, label: "Tipo de Perfil", value: authUser?.role.replace('_', ' ') || "Visitante" }
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

        <section className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Personalizar minha experiência</h3>
              <Zap className="w-5 h-5 text-orange-600" />
           </div>
           <p className="text-slate-500 font-medium mb-8 text-sm uppercase tracking-wider leading-relaxed">
              Escolha seus interesses para que possamos mostrar o que há de mais relevante para você no bairro.
           </p>
           <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                  {['negocios', 'servicos', 'transporte', 'noticias', 'eventos_religiosos', 'esportes', 'cultura'].map(interest => (
                    <button 
                      key={interest}
                      onClick={() => {
                        toast.info("Em breve: Atualização de interesses via Supabase!");
                      }}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        authUser?.interests?.includes(interest) 
                        ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100' 
                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-orange-200 hover:text-orange-600'
                      }`}
                    >
                       {interest.replace('_', ' ')}
                    </button>
                 ))}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center italic mt-4">
                 Sincronizado com seu painel de morador.
              </p>
           </div>
        </section>

        {!isAuthenticated ? (
           <section>
             <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                     <Store className="h-8 w-8 text-violet-400" />
                  </div>
                  <h3 className="text-2xl font-black mb-2 tracking-tighter leading-tight">Acesse sua conta</h3>
                  <p className="text-slate-400 font-medium mb-8 max-w-sm">
                    Entre para gerenciar seu negócio ou favoritos.
                  </p>
                  <button 
                    onClick={() => navigate({ to: '/login' })}
                    className="w-full py-5 bg-orange-600 text-white font-black text-sm rounded-2xl shadow-xl active:scale-95 transition-all"
                  >
                    Fazer Login
                  </button>
               </div>
             </div>
           </section>
        ) : (
           <div className="pt-4 flex justify-center">
              <button 
                onClick={handleLogout}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-3 h-3" />
                Sair da Conta
              </button>
           </div>
        )}
      </main>

      <FloatingNav />
    </div>
  );
}
