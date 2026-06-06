import { createFileRoute, useNavigate, Outlet, redirect, Link } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { isAuthenticatedAtom, authUserAtom } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { LogOut, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/painel")({
  beforeLoad: ({ location }) => {
    const authStatus = localStorage.getItem("axei_auth_status");
    const isAuthenticated = authStatus === "true";
    
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }

    // No longer redirecting automatically from /painel to specific sub-panels
    // This allows /painel to be the User Central Hub
    if (location.pathname === '/painel') {
      const authUserStr = localStorage.getItem("axei_auth_user");
      let authUser = null;
      try {
        authUser = authUserStr ? JSON.parse(authUserStr) : null;
      } catch (e) {}

      if (authUser && authUser.role === 'master_admin') {
        throw redirect({ to: '/admin' });
      }
    }
  },
  component: PanelLayout,
});

function PanelLayout() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [authUser, setAuthUser] = useAtom(authUserAtom);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthUser(null);
    toast.success("Você saiu com sucesso.");
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-100 h-20 sticky top-0 z-50 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-6">
            {authUser && (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xs">
                  {authUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 leading-none">{authUser.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{authUser.role}</p>
                </div>
              </div>
            )}
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Alerta de Mock */}
          <div className="mb-10 p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
             <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                   <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Modo de Estruturação</h4>
                   <p className="text-xs font-medium text-blue-600 mt-1 uppercase tracking-widest leading-relaxed">
                      Esta é uma versão preliminar do painel. A segurança real e recursos completos serão implementados na próxima fase com Supabase.
                   </p>
                </div>
             </div>
             <Button variant="outline" className="rounded-xl border-blue-200 text-blue-700 bg-white hover:bg-blue-50 font-black text-xs uppercase" asChild>
                <Link to="/">Voltar para o Site</Link>
             </Button>
          </div>

          <Outlet />
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © 2026 Axêi no Bairro — Plataforma de Marketplace Local
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">v1.0.0 Dev</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
