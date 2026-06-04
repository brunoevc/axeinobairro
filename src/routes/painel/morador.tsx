import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { authUserAtom } from "@/hooks/useAuth";
import { Heart, ShoppingBag, MessageSquare, Clock, Star } from "lucide-react";

export const Route = createFileRoute("/painel/morador")({
  component: MoradorPanel,
});

function MoradorPanel() {
  const [authUser] = useAtom(authUserAtom);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Área do <span className="text-orange-600">Morador</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg mt-2">
          Suas lojas favoritas e atividades no bairro em um só lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
            <Heart className="w-8 h-8 fill-red-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Favoritos</p>
            <p className="text-3xl font-black text-slate-900 leading-none">5</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avaliações</p>
            <p className="text-3xl font-black text-slate-900 leading-none">2</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Classificados</p>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Em Breve</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div className="flex items-center gap-4 mb-8">
            <Star className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-black text-slate-900">Histórico de Ofertas</h3>
         </div>
         <p className="text-slate-500 font-medium mb-8">
            Em breve você poderá salvar ofertas específicas para resgatar na loja física.
         </p>
         <div className="space-y-4">
            <div className="h-4 bg-slate-50 rounded-full w-full animate-pulse" />
            <div className="h-4 bg-slate-50 rounded-full w-3/4 animate-pulse" />
         </div>
      </div>
    </div>
  );
}
