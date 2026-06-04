import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { authUserAtom } from "@/hooks/useAuth";
import { Wrench, Clock, TrendingUp, Calendar, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/painel/profissional")({
  component: ProfissionalPanel,
});

function ProfissionalPanel() {
  const [authUser] = useAtom(authUserAtom);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Painel do <span className="text-blue-600">Profissional</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg mt-2">
          Gerencie sua agenda de serviços e visibilidade no bairro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Solicitações</p>
            <p className="text-3xl font-black text-slate-900 leading-none">8</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alcance</p>
            <p className="text-3xl font-black text-slate-900 leading-none">850</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Selo Verificado</p>
            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Ativo</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div className="flex items-center gap-4 mb-8">
            <Wrench className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-black text-slate-900">Configurações de Serviço</h3>
         </div>
         <p className="text-slate-500 font-medium mb-8">
            Em breve você poderá editar suas especialidades, raio de atendimento e fotos de portfólio.
         </p>
         <div className="space-y-4">
            <div className="h-4 bg-slate-50 rounded-full w-full" />
            <div className="h-4 bg-slate-50 rounded-full w-2/3" />
         </div>
      </div>
    </div>
  );
}
