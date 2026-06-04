import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { authUserAtom } from "@/hooks/useAuth";
import { Store, ShoppingBag, TrendingUp, Users, MessageSquare } from "lucide-react";
import { PixConfigForm } from "@/components/PixConfigForm";
import { merchantsRepository } from "@/repositories/merchantsRepository";

export const Route = createFileRoute("/painel/lojista")({
  component: LojistaPanel,
});

function LojistaPanel() {
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const merchant = authUser?.linkedMerchantId ? merchantsRepository.getById(authUser.linkedMerchantId) : null;

  const handleSavePix = (config: any) => {
    if (merchant) {
      const updatedMerchant = { ...merchant, pixConfig: config };
      merchantsRepository.save(updatedMerchant);
      if (authUser) {
        setAuthUser({ ...authUser, pixConfig: config });
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Olá, <span className="text-orange-600">{authUser?.name}</span>!
        </h1>
        <p className="text-slate-500 font-medium text-lg mt-2">
          Bem-vindo ao seu Painel de Lojista. Gerencie seu estabelecimento e acompanhe seus resultados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visualizações</p>
            <p className="text-3xl font-black text-slate-900 leading-none">1.240</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contatos Whats</p>
            <p className="text-3xl font-black text-slate-900 leading-none">48</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avaliações</p>
            <p className="text-3xl font-black text-slate-900 leading-none">12</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex items-center gap-4 mb-8">
              <Store className="w-6 h-6 text-orange-600" />
               <h3 className="text-xl font-black text-slate-900">Gerenciar Loja</h3>
            </div>
            {merchant && (
              <div className="mb-8">
                <PixConfigForm 
                  title="Receber via Pix"
                  description="Configure sua chave para receber pagamentos diretos dos clientes."
                  initialConfig={merchant.pixConfig}
                  onSave={handleSavePix}
                />
              </div>
            )}
            <p className="text-slate-500 font-medium mb-8">
              A estrutura de edição de produtos, horários e fotos será integrada ao Supabase para persistência real de dados.
           </p>
           <div className="space-y-4">
              <div className="h-4 bg-slate-50 rounded-full w-full animate-pulse" />
              <div className="h-4 bg-slate-50 rounded-full w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-50 rounded-full w-1/2 animate-pulse" />
           </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white">
           <h3 className="text-xl font-black mb-6">Próximos Passos</h3>
           <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-400">
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                 Integração com Supabase Storage para fotos.
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                 Módulo de promoções em tempo real.
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                 <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                 Notificações de novas avaliações.
              </li>
           </ul>
        </div>
      </div>
    </div>
  );
}
