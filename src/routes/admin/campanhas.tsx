
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAdminState } from "@/hooks/useAdminState";
import { getCampaigns, saveCampaign, canCreateCampaign } from "@/lib/campaigns";
import { Campaign, CampaignTarget, CampaignChannel } from "@/types/campaigns";
import { 
  Megaphone, 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  MousePointer2, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  Target,
  ArrowRight,
  TrendingUp,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/campanhas")({
  component: AdminCampanhas,
});

function AdminCampanhas() {
  const { state } = useAdminState();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newCampaign, setNewCampaign] = useState({
    merchantId: "",
    title: "",
    message: "",
    target: "todos" as CampaignTarget,
    channel: "painel" as CampaignChannel,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  useEffect(() => {
    setCampaigns(getCampaigns());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCampaign.merchantId) {
      toast.error("Selecione uma loja para a campanha.");
      return;
    }
    if (!newCampaign.message.trim()) {
      toast.error("A mensagem da campanha não pode estar vazia.");
      return;
    }

    const merchant = state?.merchants.find(m => m.id === newCampaign.merchantId);
    if (!merchant) return;

    // Rule: Campaign to "all" only for verified/partners
    const isVerified = merchant.status === "verified" || merchant.status === "partner" || merchant.status === "featured";
    if (newCampaign.target === "todos" && !isVerified) {
      toast.error("Somente lojas verificadas podem enviar campanhas para todos os usuários.");
      return;
    }

    const check = canCreateCampaign(newCampaign.merchantId);
    if (!check.can) {
      toast.error(check.reason);
      return;
    }

    const campaign: Campaign = {
      id: `camp-${Date.now()}`,
      merchantId: merchant.id,
      merchantName: merchant.name,
      title: newCampaign.title || `Promoção: ${merchant.name}`,
      message: newCampaign.message,
      target: newCampaign.target,
      channel: newCampaign.channel,
      startDate: new Date().toISOString(),
      endDate: new Date(newCampaign.endDate).toISOString(),
      status: "ativa",
      createdAt: new Date().toISOString(),
      stats: {
        impacted: Math.floor(Math.random() * 500) + 100,
        clicks: 0,
        responses: 0,
        conversions: 0,
      }
    };

    saveCampaign(campaign);
    setCampaigns(getCampaigns());
    setIsCreating(false);
    setNewCampaign({
      merchantId: "",
      title: "",
      message: "",
      target: "todos",
      channel: "painel",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    toast.success("Campanha criada e disparada com sucesso!");
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.merchantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">
            Campanhas <span className="text-orange-600">Comerciais</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-1">
            Impulsione negócios locais com disparos promocionais inteligentes.
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="rounded-2xl font-black gap-2 h-14 px-8 bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-200 transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Nova Campanha
        </Button>
      </header>

      {isCreating && (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-8 md:p-12 relative overflow-hidden">
          <button 
            onClick={() => setIsCreating(false)}
            className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-orange-600 rounded-2xl text-white">
              <Megaphone className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Configurar Disparo</h2>
          </div>

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Loja Relacionada</label>
                <select 
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 focus:bg-white transition-all shadow-sm"
                  value={newCampaign.merchantId}
                  onChange={(e) => setNewCampaign({...newCampaign, merchantId: e.target.value})}
                >
                  <option value="">Selecione uma loja...</option>
                  {state?.merchants.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Público-alvo</label>
                <select 
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 focus:bg-white transition-all shadow-sm"
                  value={newCampaign.target}
                  onChange={(e) => setNewCampaign({...newCampaign, target: e.target.value as CampaignTarget})}
                >
                  <option value="todos">Todos os usuários (Somente lojas verificadas)</option>
                  <option value="bairro">Por Bairro da Loja</option>
                  <option value="categoria">Por Categoria</option>
                  <option value="leads">Apenas meus leads (CRM)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Canal de Disparo</label>
                <select 
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 focus:bg-white transition-all shadow-sm"
                  value={newCampaign.channel}
                  onChange={(e) => setNewCampaign({...newCampaign, channel: e.target.value as CampaignChannel})}
                >
                  <option value="painel">Destaque no Painel Principal</option>
                  <option value="push_mock">Push Notification (Simulado)</option>
                  <option value="whatsapp_manual">WhatsApp Manual (via Link)</option>
                </select>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Título da Campanha</label>
                <input 
                  type="text"
                  placeholder="Ex: Oferta Relâmpago de Pizza"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 focus:bg-white transition-all shadow-sm"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mensagem Promocional</label>
                <textarea 
                  rows={4}
                  placeholder="Escreva a mensagem que os clientes receberão..."
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 focus:bg-white transition-all shadow-sm resize-none"
                  value={newCampaign.message}
                  onChange={(e) => setNewCampaign({...newCampaign, message: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <Button 
                  type="submit"
                  className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 shadow-xl transition-all"
                >
                  Disparar Campanha
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 h-16 border-slate-200 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns List */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Filtrar campanhas..."
              className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-600 outline-none font-bold text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-2xl border border-orange-100">
            <Filter className="w-4 h-4 text-orange-600" />
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Filtros Avançados</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map(campaign => (
              <div key={campaign.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <Megaphone className="w-32 h-32 -rotate-12" />
                </div>

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-orange-500 shadow-xl shadow-slate-200">
                      <Megaphone className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{campaign.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{campaign.merchantName}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    campaign.status === 'ativa' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                    {campaign.status}
                  </div>
                </div>

                <p className="text-slate-500 font-medium mb-8 line-clamp-2 relative z-10">{campaign.message}</p>

                <div className="grid grid-cols-4 gap-4 pt-6 border-t border-slate-50 relative z-10">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impacto</p>
                    <p className="text-lg font-black text-slate-900">{campaign.stats.impacted}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cliques</p>
                    <p className="text-lg font-black text-slate-900">{campaign.stats.clicks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Respostas</p>
                    <p className="text-lg font-black text-slate-900">{campaign.stats.responses}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conv.</p>
                    <p className="text-lg font-black text-orange-600">{campaign.stats.conversions}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-slate-100">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Megaphone className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-400 font-bold text-lg">Nenhuma campanha registrada no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
