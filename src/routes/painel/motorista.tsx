import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { authUserAtom } from "@/hooks/useAuth";
import { Car, MapPin, Star, History } from "lucide-react";
import { PixConfigForm } from "@/components/PixConfigForm";
import { ridesRepository } from "@/repositories/ridesRepository";

export const Route = createFileRoute("/painel/motorista")({
  component: MotoristaPanel,
});

function MotoristaPanel() {
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const ride = authUser?.linkedDriverId ? ridesRepository.getById(authUser.linkedDriverId) : null;

  const handleSavePix = (config: any) => {
    if (ride) {
      const updatedRide = { ...ride, pixConfig: config };
      ridesRepository.save(updatedRide);
      if (authUser) {
        setAuthUser({ ...authUser, pixConfig: config });
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Central do <span className="text-orange-600">Motorista</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg mt-2">
          Gerencie suas rotas e disponibilidade para os moradores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
            <p className="text-xl font-black text-emerald-500 uppercase">Disponível</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
            <Star className="w-8 h-8 fill-orange-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avaliação</p>
            <p className="text-3xl font-black text-slate-900 leading-none">4.9</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div className="flex items-center gap-4 mb-8">
             <MapPin className="w-6 h-6 text-orange-600" />
             <h3 className="text-xl font-black text-slate-900">Área de Atuação</h3>
          </div>
          {ride && (
            <div className="mb-8">
              <PixConfigForm 
                title="Receber via Pix"
                description="Configure sua chave para que passageiros possam pagar diretamente."
                initialConfig={ride.pixConfig}
                onSave={handleSavePix}
              />
            </div>
          )}
          <p className="text-slate-500 font-medium mb-8">
            Defina os bairros onde você mais atua para aparecer prioritariamente nas buscas.
         </p>
         <div className="flex flex-wrap gap-2">
            {['Centro', 'Vila Capri', 'Pontinha'].map(hood => (
              <span key={hood} className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100">
                {hood}
              </span>
            ))}
         </div>
      </div>
    </div>
  );
}
