
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAdminState } from "@/hooks/useAdminState";
import { getLeads } from "@/lib/leads";
import { Lead } from "@/types/leads";
import { LeadPipeline } from "@/components/admin/LeadPipeline";
import { LeadList } from "@/components/admin/LeadList";
import { 
  Users, 
  LayoutGrid, 
  List, 
  ArrowLeft,
  Search,
  Download,
  Filter,
  TrendingUp,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeads,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      merchantId: (search.merchantId as string) || undefined,
    };
  },
});

function AdminLeads() {
  const { state, loading } = useAdminState();
  const { merchantId } = Route.useSearch();
  const [leads, setLeads] = useState<Lead[]>([]);

  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline");

  const loadLeads = () => {
    const allLeads = getLeads();
    if (merchantId) {
      setLeads(allLeads.filter(l => l.merchantId === merchantId));
    } else {
      setLeads(allLeads);
    }
  };


  useEffect(() => {
    loadLeads();
  }, []);

  if (loading || !state) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg text-slate-400 font-black animate-pulse uppercase tracking-widest">Carregando CRM...</p>
        </div>
      </div>
    );
  }

  const totalValue = leads.reduce((acc, lead) => acc + (lead.estimatedValue || 0), 0);
  const conversionRate = leads.length > 0 
    ? Math.round((leads.filter(l => l.status === 'cliente').length / leads.length) * 100) 
    : 0;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Button asChild variant="ghost" className="rounded-2xl w-14 h-14 p-0 border border-slate-100 hover:bg-slate-50 transition-all">
            <Link to="/admin">
              <ArrowLeft className="h-6 w-6 text-slate-400" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">
              CRM de <span className="text-orange-600">Leads</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Gestão comercial e funil de vendas dos lojistas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
          <Button 
            variant={viewMode === "pipeline" ? "default" : "ghost"}
            className={cn(
              "rounded-xl h-11 px-6 font-black uppercase tracking-widest text-[10px]",
              viewMode === "pipeline" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400"
            )}
            onClick={() => setViewMode("pipeline")}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Funil
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "ghost"}
            className={cn(
              "rounded-xl h-11 px-6 font-black uppercase tracking-widest text-[10px]",
              viewMode === "list" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400"
            )}
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4 mr-2" />
            Lista
          </Button>
        </div>
      </header>

      {/* Leads Stats Snapshot */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total de Leads</p>
          </div>
          <p className="text-5xl font-black text-slate-900 tracking-tighter">{leads.length}</p>
          <p className="text-[11px] font-bold text-slate-500 mt-2">Novas oportunidades geradas</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket Estimado</p>
          </div>
          <p className="text-5xl font-black text-slate-900 tracking-tighter">
            R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
          </p>
          <p className="text-[11px] font-bold text-slate-500 mt-2">Valor acumulado em pedidos</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-violet-50 text-violet-600">
              <Target className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversão</p>
          </div>
          <p className="text-5xl font-black text-slate-900 tracking-tighter">{conversionRate}%</p>
          <p className="text-[11px] font-bold text-slate-500 mt-2">Leads que viraram clientes</p>
        </div>
      </section>

      {/* Main CRM Content */}
      <section className={cn(
        "bg-white border border-slate-100 rounded-[3rem] shadow-sm",
        viewMode === "pipeline" ? "p-10 pb-2" : "p-10"
      )}>
        {viewMode === "pipeline" ? (
          <LeadPipeline 
            leads={leads} 
            onUpdate={loadLeads} 
            merchants={state.merchants} 
          />
        ) : (
          <LeadList 
            leads={leads} 
            merchants={state.merchants} 
            onUpdate={loadLeads} 
          />
        )}
      </section>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
