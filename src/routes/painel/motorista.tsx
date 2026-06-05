import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { authUserAtom } from "@/hooks/useAuth";
import { Car, MapPin, Star, History, Calendar, Users, LayoutDashboard } from "lucide-react";
import { PixConfigForm } from "@/components/PixConfigForm";
import { ridesRepository } from "@/repositories/ridesRepository";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgendaManager } from "@/components/AgendaManager";
import { CRMManager } from "@/components/CRMManager";
import { appointmentsRepository } from "@/repositories/appointmentsRepository";
import { crmRepository } from "@/repositories/crmRepository";

export const Route = createFileRoute("/painel/motorista")({
  component: MotoristaPanel,
});

function MotoristaPanel() {
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const ride = authUser?.linkedDriverId ? ridesRepository.getById(authUser.linkedDriverId) : null;
  const driverId = ride?.id || authUser?.id || "default";

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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-24">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Central do <span className="text-orange-600">Motorista</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg mt-2">
          Gerencie suas corridas, clientes recorrentes e disponibilidade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
            <p className="text-xl font-black text-emerald-500 uppercase">Ativo</p>
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

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <History className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Corridas</p>
            <p className="text-3xl font-black text-slate-900 leading-none">124</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-2xl h-14 mb-8">
          <TabsTrigger value="overview" className="rounded-xl font-black gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
            <LayoutDashboard className="w-4 h-4" /> Geral
          </TabsTrigger>
          <TabsTrigger value="agenda" className="rounded-xl font-black gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
            <Calendar className="w-4 h-4" /> Corridas Agendadas
          </TabsTrigger>
          <TabsTrigger value="crm" className="rounded-xl font-black gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
            <Users className="w-4 h-4" /> Clientes Recorrentes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
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
        </TabsContent>

        <TabsContent value="agenda">
          <AgendaManager merchantId={driverId} />
        </TabsContent>

        <TabsContent value="crm">
          <CRMManager merchantId={driverId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
