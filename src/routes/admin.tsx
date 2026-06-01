import { createFileRoute, useNavigate, Outlet, Link, redirect } from "@tanstack/react-router";
import { LayoutDashboard, Store, CheckCircle, CreditCard, ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAtom } from "jotai";
import { isAuthenticatedAtom } from "@/hooks/useAuth";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    const authStatus = localStorage.getItem("axei_auth_status");
    const isAuthenticated = authStatus === "true";
    
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

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast.success("Você saiu com sucesso.");
    navigate({ to: "/login" });
  };


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="w-full md:w-72 bg-white border-b md:border-r border-slate-100 flex flex-col sticky top-0 md:h-screen z-40">
        <div className="p-8 border-b border-slate-50 hidden md:flex items-center gap-4">
          <Logo />
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100">
           <Logo className="scale-75 origin-left" />
           <button onClick={() => navigate({ to: '/' })} className="p-2 text-slate-400">
              <LogOut className="w-5 h-5" />
           </button>
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
