import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Megaphone, Users, MapPin, TrendingUp, ShieldCheck } from "lucide-react";
import { PixConfigForm } from "@/components/PixConfigForm";
import { representativesRepository } from "@/repositories/representativesRepository";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/painel/representante")({
  component: RepresentantePanel,
});

function RepresentantePanel() {
  const { user: authUser } = useAuth();
  const rep = authUser?.id ? representativesRepository.getAll().find(r => r.id === authUser.id) : null;

  const handleSavePix = (config: any) => {
    toast.info("Em breve: Atualização de Pix via Supabase!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Painel de <span className="text-violet-600">Representante</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg mt-2">
          Expanda o Axêi no Bairro na sua região e gerencie seus cadastros.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Lojas Cadastradas</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-black text-slate-900">14</p>
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Comissão Prevista</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-black text-slate-900">R$ 420</p>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Status Regional</p>
          <div className="flex items-end justify-between">
            <p className="text-xl font-black text-violet-600 uppercase">Líder Regional</p>
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div className="flex items-center gap-4 mb-8">
             <MapPin className="w-6 h-6 text-violet-600" />
             <h3 className="text-xl font-black text-slate-900">Minha Área: Araruama (Centro)</h3>
          </div>
          {rep && (
            <div className="mb-8">
              <PixConfigForm 
                title="Receber via Pix"
                description="Configure sua chave para receber comissões ou doações."
                initialConfig={rep.pixConfig}
                onSave={handleSavePix}
              />
            </div>
          )}
          <p className="text-slate-500 font-medium mb-8">
            Em breve você poderá visualizar o mapa de calor de lojas ativas e prospectar novos parceiros diretamente pelo painel.
         </p>
         <Button className="rounded-xl bg-violet-600 hover:bg-violet-700 font-black uppercase text-xs">
            Baixar Material de Apoio
         </Button>
      </div>
    </div>
  );
}
