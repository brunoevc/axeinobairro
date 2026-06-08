import { createFileRoute, useNavigate, Outlet, redirect, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { LogOut, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/painel")({
  beforeLoad: ({ location }) => {
    // Basic pre-check using localStorage as a hint for the router
    const authStatus = localStorage.getItem("supabase.auth.token") || localStorage.getItem("sb-ntlukuadshugxopiwqyf-auth-token");
    const isAuthenticated = !!authStatus;
    
    if (!isAuthenticated && location.pathname !== '/login') {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: PanelLayout,
});

function PanelLayout() {
  const navigate = useNavigate();
  const { user: authUser, signOut, loading } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

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
          <Outlet />
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © 2026 Axêi no Bairro — Plataforma de Marketplace Local
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">v1.0.0 Beta</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
