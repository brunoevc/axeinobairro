import { createFileRoute, Link } from "@tanstack/react-router";
import { useAdminState } from "@/hooks/useAdminState";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { PlansChart } from "@/components/admin/PlansChart";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { ShieldCheck, Info, TrendingUp, BarChart3, Clock, Layout, Save, Lock, Mail, CheckCircle2 } from "lucide-react";
import { ImageUploadPreview } from "@/components/ImageUploadPreview";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { passwordAtom, recoveryRequestsAtom } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — Admin Axêi" },
      { name: "description", content: "Visão geral do marketplace" },
    ],
  }),
});

function AdminDashboard() {
  const { stats, state, loading } = useAdminState();
  const [platformLogo, setPlatformLogo] = useState("");
  const [adminPassword, setAdminPassword] = useAtom(passwordAtom);
  const [recoveryRequests] = useAtom(recoveryRequestsAtom);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("platform_logo_url");
    if (saved) setPlatformLogo(saved);
  }, []);

  const handleSavePlatformConfig = () => {
    localStorage.setItem("platform_logo_url", platformLogo);
    toast.success("Configurações visuais salvas com sucesso!");
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => window.location.reload(), 500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPass !== adminPassword) {
      toast.error("Senha atual incorreta.");
      return;
    }
    if (newPass.length < 6) {
      toast.error("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("As novas senhas não coincidem.");
      return;
    }

    setAdminPassword(newPass);
    toast.success("Senha alterada com sucesso!");
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };



  if (loading || !stats || !state) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg text-slate-400 font-bold animate-pulse">Sincronizando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">
            Dashboard do <span className="text-orange-600">Marketplace</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Métricas de engajamento e status operacional da rede.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Sistema Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <section>
        <DashboardStats stats={stats} />
      </section>

      {/* Plans and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Distribuição de Planos</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Nível de assinatura dos lojistas</p>
            </div>
            <BarChart3 className="w-5 h-5 text-violet-500" />
          </div>
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <PlansChart stats={stats} />
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Atividade Recente</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Últimas interações no sistema</p>
            </div>
            <TrendingUp className="w-5 h-5 text-violet-500" />
          </div>
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm max-h-[450px] overflow-y-auto scrollbar-hide">
            <ActivityLog actions={state.actions} />
          </div>
        </section>
      </div>

      {/* Detailed Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Neighborhoods */}
        <div className="rounded-[2.5rem] bg-white p-8 border border-slate-100 shadow-sm">
          <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Lojas por Bairro</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Densidade comercial por região</p>
            </div>
          </div>
          <div className="space-y-6">
            {Object.entries(stats.merchantsByNeighborhood)
              .sort(([, a], [, b]) => b - a)
              .map(([neighborhood, count]) => (
                <div
                  key={neighborhood}
                  className="flex items-center justify-between group"
                >
                  <span className="text-sm font-black text-slate-500 group-hover:text-slate-900 transition-colors">{neighborhood}</span>
                  <div className="flex items-center gap-4">
                    <div className="h-1.5 w-24 bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-violet-600 rounded-full shadow-lg shadow-violet-200" 
                        style={{ width: `${(count / stats.totalMerchants) * 100}%` }}
                      />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-[10px] font-black uppercase border border-violet-100">
                      {count} {count === 1 ? 'loja' : 'lojas'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Contact Metrics */}
        <div className="rounded-[2.5rem] bg-white p-8 border border-slate-100 shadow-sm">
          <div className="mb-8 flex items-center justify-between border-b border-slate-50 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Métricas de Conversão</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Engajamento real com os lojistas</p>
            </div>
          </div>
          <div className="space-y-10">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                  Cliques no WhatsApp
                </p>
                <p className="text-6xl font-black text-slate-900 tracking-tighter">
                  {stats.totalWhatsappClicks}
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase border border-emerald-100">
                  {stats.totalMerchants > 0 ? (stats.totalWhatsappClicks / stats.totalMerchants).toFixed(1) : 0} / Loja
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                  Interesse Gerado
                </p>
                <p className="text-6xl font-black text-slate-900 tracking-tighter">
                  {stats.totalContactAttempts}
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-600 text-white text-[11px] font-black uppercase shadow-lg shadow-orange-200">
                  {stats.totalContactAttempts > 0
                    ? Math.round((stats.totalWhatsappClicks / stats.totalContactAttempts) * 100)
                    : 0}% Conversão
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Configuration Section */}
      <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-50 rounded-xl text-orange-600">
                <Layout className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Configuração Visual da Plataforma</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Personalize a identidade do Axêi no Bairro</p>
             </div>
          </div>
          <Button 
            onClick={handleSavePlatformConfig}
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl h-12 px-6 font-black shadow-lg shadow-orange-100 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>

        <div className="max-w-4xl">
          <ImageUploadPreview
            label="Logo da Plataforma (Horizontal)"
            description="Substitui o texto 'Axêi no Bairro' no TopBar e Footer"
            recommendedSize="1200x400 px • PNG transparente"
            aspectRatio="horizontal"
            value={platformLogo}
            onChange={setPlatformLogo}
          />
        </div>
      </section>


      {/* Info Box */}
      <div className="rounded-[2.5rem] bg-slate-900 p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] -mr-40 -mt-40" />
        
        <h3 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-white/10 rounded-xl text-violet-400">
            <Info className="w-5 h-5" />
          </div>
          Ambiente de Demonstração
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ul className="space-y-6">
            <li className="flex items-start gap-4 group">
              <div className="mt-1 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-violet-600 group-hover:border-violet-600 transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <p className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">
                Os dados acima são simulados e persistidos localmente no seu navegador para esta sessão.
              </p>
            </li>
            <li className="flex items-start gap-4 group">
              <div className="mt-1 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-violet-600 group-hover:border-violet-600 transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <p className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">
                Este painel representa a visão do administrador da plataforma Axêi no Bairro.
              </p>
            </li>
          </ul>
          
          <div className="flex flex-col justify-end items-end gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 mb-4">
               <Clock className="w-4 h-4 text-violet-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Última Sincronização: {new Date(state.lastUpdated).toLocaleTimeString("pt-BR")}</span>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">v1.0.0 Stable Build</span>
               <div className="h-4 w-px bg-white/10" />
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
