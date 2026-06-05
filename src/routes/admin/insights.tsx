import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Flame, 
  TrendingUp, 
  MapPin, 
  Layout, 
  Calendar, 
  Target, 
  ChevronRight,
  Store,
  ArrowUpRight,
  ExternalLink,
  Users
} from "lucide-react";
import { intentTracker } from "@/utils/intent-tracker";
import { useMemo } from "react";
import { Opportunity, EconomicCategory, Territory, PlanType } from "@/types/business-intelligence";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/insights")({
  component: InsightsDashboard,
});

function InsightsDashboard() {
  const events = useMemo(() => intentTracker.getEvents(), []);

  // Inteligência Comercial: Calcular scores dinamicamente
  const opportunities = useMemo(() => {
    const scores: Record<string, { count: number; lastActivity: number }> = {};
    
    events.forEach(event => {
      const key = `${event.territory}-${event.category}`;
      if (!scores[key]) {
        scores[key] = { count: 0, lastActivity: 0 };
      }
      
      // Pesos para o Score
      let weight = 1;
      if (event.type === 'click_plan') weight = 15;
      if (event.type === 'contact_click') weight = 10;
      if (event.type === 'view_business') weight = 2;
      
      scores[key].count += weight;
      if (event.timestamp > scores[key].lastActivity) {
        scores[key].lastActivity = event.timestamp;
      }
    });

    const list: Opportunity[] = Object.entries(scores).map(([key, data]) => {
      const [territory, category] = key.split('-') as [Territory, EconomicCategory];
      
      // Lógica para plano sugerido baseada na categoria
      let suggestedPlan: PlanType = 'Destaque';
      if (category === 'mercado') suggestedPlan = 'Patrocinador';
      if (category === 'farmacia') suggestedPlan = 'Premium';
      
      const score = data.count;
      let classification: 'Quente' | 'Morna' | 'Fria' = 'Fria';
      if (score >= 100) classification = 'Quente';
      else if (score >= 50) classification = 'Morna';

      return {
        id: key,
        territory,
        category,
        suggestedPlan,
        score,
        classification,
        lastActivity: data.lastActivity
      };
    });

    return list.sort((a, b) => b.score - a.score);
  }, [events]);

  const topOpportunities = opportunities.slice(0, 5);

  const stats = {
    totalInteractions: events.length,
    hotOpps: opportunities.filter(o => o.classification === 'Quente').length,
    mostActiveTerritory: opportunities[0]?.territory || 'Nenhum',
    topCategory: opportunities[0]?.category || 'Nenhuma'
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tight flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-orange-600" />
          Inteligência Comercial
        </h1>
        <p className="text-slate-500 font-medium">Identifique quem visitar hoje com base em dados de intenção real.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden group hover:border-orange-200 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Intenções</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalInteractions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden group hover:border-orange-200 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Opps Quentes</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats.hotOpps}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden group hover:border-orange-200 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Bairro Ativo</p>
                <p className="text-2xl font-black text-slate-900 mt-1 truncate max-w-[120px]">{stats.mostActiveTerritory}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden group hover:border-orange-200 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                <Layout className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Categoria Top</p>
                <p className="text-2xl font-black text-slate-900 mt-1 capitalize">{stats.topCategory}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Oportunidades List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900 italic uppercase tracking-tight flex items-center gap-2">
              🔥 Próximas Visitas Recomendadas
            </h2>
          </div>

          <div className="space-y-3">
            {topOpportunities.length > 0 ? (
              topOpportunities.map((opp) => (
                <div 
                  key={opp.id}
                  className="bg-white border border-slate-100 p-5 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      opp.classification === 'Quente' ? 'bg-orange-600 text-white' : 
                      opp.classification === 'Morna' ? 'bg-orange-100 text-orange-600' : 
                      'bg-slate-50 text-slate-400'
                    }`}>
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 uppercase tracking-tight">{opp.territory}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest capitalize">{opp.category}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <Badge variant="outline" className={`rounded-lg font-black text-[10px] uppercase border-none ${
                          opp.classification === 'Quente' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          Score: {opp.score}
                        </Badge>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plano sugerido: {opp.suggestedPlan}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</p>
                      <p className={`text-xs font-black uppercase mt-1 ${
                        opp.classification === 'Quente' ? 'text-red-600' : 'text-orange-600'
                      }`}>{opp.classification}</p>
                    </div>
                    <button className="h-10 px-6 bg-slate-900 text-white rounded-xl font-black italic uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all flex items-center gap-2">
                      Visitar <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-100 p-12 rounded-[3rem] text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aguardando dados de intenção...</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6 px-8">
              <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                Destaques por Canal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
               <div className="space-y-6">
                 {['Home', 'Busca', 'Planos'].map((channel, i) => (
                   <div key={channel} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 font-black text-xs">{i+1}</div>
                       <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{channel}</span>
                     </div>
                     <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">+{Math.floor(Math.random() * 50)}%</span>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100 shadow-md shadow-orange-100/50 rounded-[2rem] overflow-hidden bg-orange-600 text-white">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tight mb-2">Próximo Passo Comercial</h3>
              <p className="text-sm font-medium text-white/80 leading-relaxed mb-6">
                Os <b>Mercados</b> da <b>Pontinha</b> demonstraram 140% mais interesse em planos de patrocínio nesta semana.
              </p>
              <button className="w-full h-12 bg-white text-orange-600 rounded-2xl font-black italic uppercase tracking-widest text-xs hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                Ver Relatório <ExternalLink className="w-3 h-3" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
