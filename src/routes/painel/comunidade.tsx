import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { authUserAtom } from "@/hooks/useAuth";
import { Users, Calendar, MessageSquare, Megaphone, ShieldAlert, Heart, Info } from "lucide-react";
import { communitiesRepository } from "@/repositories/communitiesRepository";
import { Button } from "@/components/ui/button";
import { PixConfigForm } from "@/components/PixConfigForm";


export const Route = createFileRoute("/painel/comunidade")({
  component: ComunidadePanel,
});

function ComunidadePanel() {
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const communities = communitiesRepository.getAll();
  const linkedCommunity = authUser?.faithCommunity ? communities.find(c => c.name === authUser.faithCommunity) : communities[0];

  const handleSavePix = (config: any) => {
    if (linkedCommunity) {
      const updatedCommunity = { ...linkedCommunity, pixConfig: config };
      communitiesRepository.save(updatedCommunity);
      // Update local auth user too if needed
      if (authUser) {
        setAuthUser({ ...authUser, pixConfig: config });
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Painel da <span className="text-violet-600">Comunidade</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2 italic">
            Gerencie comunicados e eventos para seus seguidores.
          </p>
        </div>
        {linkedCommunity && (
          <div className="px-4 py-2 bg-violet-50 rounded-2xl border border-violet-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-black text-violet-700 uppercase">{linkedCommunity.name}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Seguidores</p>
            <p className="text-3xl font-black text-slate-900 leading-none">156</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Eventos Ativos</p>
            <p className="text-3xl font-black text-slate-900 leading-none">3</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Megaphone className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alcance Semanal</p>
            <p className="text-3xl font-black text-slate-900 leading-none">1.2k</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="flex items-center gap-4 mb-8">
                <Megaphone className="w-6 h-6 text-violet-600" />
                <h3 className="text-xl font-black text-slate-900">Comunicados e Ações</h3>
             </div>
             <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black text-violet-600 uppercase mb-2">Ação Social</p>
                  <p className="text-sm font-bold text-slate-700">Arrecadação de alimentos para o inverno - Sábado às 14h.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black text-violet-600 uppercase mb-2">Evento</p>
                  <p className="text-sm font-bold text-slate-700">Encontro de Jovens - Próxima Terça.</p>
                </div>
             </div>
             <Button className="w-full mt-8 rounded-xl bg-violet-600 hover:bg-violet-700 font-black uppercase text-xs">
                Novo Comunicado
             </Button>
          </div>

          {linkedCommunity && (
            <PixConfigForm 
              title="Pix da Comunidade"
              description="Informar chave Pix para dízimos, doações ou campanhas."
              initialConfig={linkedCommunity.pixConfig}
              onSave={handleSavePix}
            />
          )}
        </div>

        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
           <div className="flex items-center gap-3 mb-6">
             <ShieldAlert className="w-6 h-6 text-orange-500" />
             <h3 className="text-xl font-black">Área do Líder</h3>
           </div>
           <p className="text-slate-400 text-sm leading-relaxed mb-8">
             Você está gerenciando uma comunidade {linkedCommunity?.type}. 
             O Axêi no Bairro promove a união local respeitando a diversidade.
           </p>
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                 Perfil Verificado
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                 <div className="w-2 h-2 rounded-full bg-blue-500" />
                 Integração WhatsApp Ativa
              </div>
           </div>
           <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3">
              <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                A segurança real e recursos de engajamento serão ativados via Supabase Auth.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

