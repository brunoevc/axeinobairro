import { createFileRoute, useNavigate, Outlet, Link, redirect } from "@tanstack/react-router";
import { LayoutDashboard, Store, CheckCircle, CreditCard, ArrowLeft, LogOut, ShieldCheck, User, Megaphone, Car, Zap, Lock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAtom } from "jotai";
import { isAuthenticatedAtom, authUserAtom } from "@/hooks/useAuth";
import { useEffect } from "react";
import { toast } from "sonner";

const IS_ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === 'true';

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (!IS_ADMIN_ENABLED) {
      return; // Permite carregar para mostrar o aviso de desativado
    }

    const authStatus = localStorage.getItem("axei_auth_status");
    const authUser = localStorage.getItem("axei_auth_user");
    const isAuthenticated = authStatus === "true" && authUser !== null && authUser !== "null";
    
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AdminLayout,
});


function AdminLayout() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [authUser, setAuthUser] = useAtom(authUserAtom);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthUser(null);
    toast.success("Você saiu com sucesso.");
    navigate({ to: "/login" });
  };


  if (!IS_ADMIN_ENABLED) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-xl text-center border border-slate-100">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-4 italic uppercase tracking-tight">
            Acesso Restrito
          </h1>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            A área administrativa está temporariamente indisponível para o público durante esta fase de lançamento.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white rounded-2xl font-black italic uppercase tracking-widest text-sm hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-72 bg-white border-b md:border-r border-slate-100 flex flex-col sticky top-0 md:h-screen z-40">
        <div className="p-8 border-b border-slate-50 hidden md:flex flex-col gap-6">
          <Logo />
          
          {authUser && (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                {authUser.avatar ? (
                  <img src={authUser.avatar} alt={authUser.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-orange-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">{authUser.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${authUser.provider === 'google' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                    {authUser.provider === 'google' ? 'Google Login' : 'Acesso Local'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100">
           <Logo className="scale-75 origin-left" />
           <div className="flex items-center gap-3">
              {authUser && (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                   {authUser.avatar ? (
                     <img src={authUser.avatar} alt={authUser.name} className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-4 h-4 text-slate-400" />
                   )}
                </div>
              )}
              <button onClick={handleLogout} className="p-2 text-slate-400">
                 <LogOut className="w-5 h-5" />
              </button>
           </div>
        </div>

        <nav className="flex md:flex-col p-4 md:p-6 gap-2 overflow-x-auto md:overflow-x-visible">
          <Link 
            to="/admin" 
            activeProps={{ className: "bg-orange-600 text-white shadow-lg shadow-orange-200" }}
            inactiveProps={{ className: "text-slate-500 hover:bg-slate-50 hover:text-slate-900" }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all shrink-0 md:shrink"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/admin/lojas" 
            activeProps={{ className: "bg-orange-600 text-white shadow-lg shadow-orange-200" }}
            inactiveProps={{ className: "text-slate-500 hover:bg-slate-50 hover:text-slate-900" }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all shrink-0 md:shrink"
          >
            <Store className="h-5 w-5" />
            <span>Minhas Lojas</span>
          </Link>
          <Link 
            to="/admin/aprovacoes" 
            activeProps={{ className: "bg-orange-600 text-white shadow-lg shadow-orange-200" }}
            inactiveProps={{ className: "text-slate-500 hover:bg-slate-50 hover:text-slate-900" }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all shrink-0 md:shrink"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Aprovações</span>
          </Link>
          <Link 
            to="/admin/planos" 
            activeProps={{ className: "bg-orange-600 text-white shadow-lg shadow-orange-200" }}
            inactiveProps={{ className: "text-slate-500 hover:bg-slate-50 hover:text-slate-900" }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all shrink-0 md:shrink"
          >
            <CreditCard className="h-5 w-5" />
            <span>Planos</span>
          </Link>
          <Link 
            to="/admin/campanhas" 
            activeProps={{ className: "bg-orange-600 text-white shadow-lg shadow-orange-200" }}
            inactiveProps={{ className: "text-slate-500 hover:bg-slate-50 hover:text-slate-900" }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all shrink-0 md:shrink"
          >
            <Megaphone className="h-5 w-5" />
            <span>Campanhas</span>
          </Link>
          <Link 
            to="/admin/destaques" 
            activeProps={{ className: "bg-orange-600 text-white shadow-lg shadow-orange-200" }}
            inactiveProps={{ className: "text-slate-500 hover:bg-slate-50 hover:text-slate-900" }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all shrink-0 md:shrink"
          >
            <Zap className="h-5 w-5" />
            <span>Destaques</span>
          </Link>
          <Link 
            to="/admin/transporte" 
            activeProps={{ className: "bg-orange-600 text-white shadow-lg shadow-orange-200" }}
            inactiveProps={{ className: "text-slate-500 hover:bg-slate-50 hover:text-slate-900" }}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all shrink-0 md:shrink"
          >
            <Car className="h-5 w-5" />
            <span>Transporte</span>
          </Link>


        </nav>

        <div className="mt-auto p-6 hidden md:block">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
