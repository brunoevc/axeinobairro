import { createFileRoute, useNavigate, Outlet, Link } from "@tanstack/react-router";
import { LayoutDashboard, Store, CheckCircle, CreditCard, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar - Desktop / Bottom Nav - Mobile */}
      <aside className="w-full md:w-64 bg-card border-b md:border-r border-border/50 flex flex-col sticky top-0 z-40">
        <div className="p-6 border-b border-border/50 hidden md:flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">A</div>
          <div>
            <p className="font-black text-foreground leading-tight">Admin</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Painel Axêi</p>
          </div>
        </div>

        <nav className="flex md:flex-col p-2 md:p-4 gap-1 overflow-x-auto md:overflow-x-visible">
          <Link 
            to="/admin" 
            activeProps={{ className: "bg-primary/10 text-primary" }}
            inactiveProps={{ className: "text-muted-foreground hover:bg-secondary" }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all shrink-0 md:shrink"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
          <Link 
            to="/admin/lojas" 
            activeProps={{ className: "bg-primary/10 text-primary" }}
            inactiveProps={{ className: "text-muted-foreground hover:bg-secondary" }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all shrink-0 md:shrink"
          >
            <Store className="h-5 w-5" />
            <span className="hidden md:inline">Lojas</span>
          </Link>
          <Link 
            to="/admin/aprovacoes" 
            activeProps={{ className: "bg-primary/10 text-primary" }}
            inactiveProps={{ className: "text-muted-foreground hover:bg-secondary" }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all shrink-0 md:shrink"
          >
            <CheckCircle className="h-5 w-5" />
            <span className="hidden md:inline">Aprovações</span>
          </Link>
          <Link 
            to="/admin/planos" 
            activeProps={{ className: "bg-primary/10 text-primary" }}
            inactiveProps={{ className: "text-muted-foreground hover:bg-secondary" }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all shrink-0 md:shrink"
          >
            <CreditCard className="h-5 w-5" />
            <span className="hidden md:inline">Planos</span>
          </Link>
        </nav>

        <div className="mt-auto p-4 hidden md:block">
          <button 
            onClick={() => navigate({ to: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-secondary transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}