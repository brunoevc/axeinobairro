import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Wrench, Calendar, LayoutDashboard, Users } from "lucide-react";
import { PixConfigForm } from "@/components/PixConfigForm";
import { servicesRepository } from "@/repositories/servicesRepository";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgendaManager } from "@/components/AgendaManager";
import { CRMManager } from "@/components/CRMManager";
import { ProfessionalDashboardMetrics } from "@/components/ProfessionalDashboardMetrics";
import { appointmentsRepository } from "@/repositories/appointmentsRepository";
import { crmRepository } from "@/repositories/crmRepository";

export const Route = createFileRoute("/painel/profissional")({
  component: ProfissionalPanel,
});

function ProfissionalPanel() {
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const service = authUser?.linkedServiceId ? servicesRepository.getAll().find(s => s.id === authUser.linkedServiceId) : null;
  const merchantId = service?.id || authUser?.id || "default";

  const appointments = appointmentsRepository.getByMerchant(merchantId);
  const customers = crmRepository.getByMerchant(merchantId);

  const handleSavePix = (config: any) => {
    if (service) {
      const updatedService = { ...service, pixConfig: config };
      servicesRepository.save(updatedService);
      if (authUser) {
        setAuthUser({ ...authUser, pixConfig: config });
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Painel do <span className="text-blue-600">Profissional</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">
            Central de gestão e visibilidade do {service?.name || "seu negócio"}.
          </p>
        </div>
      </div>

      <ProfessionalDashboardMetrics appointments={appointments} customers={customers} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-2xl h-14 mb-8">
          <TabsTrigger value="overview" className="rounded-xl font-black gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
            <LayoutDashboard className="w-4 h-4" /> Visão Geral
          </TabsTrigger>
          <TabsTrigger value="agenda" className="rounded-xl font-black gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
            <Calendar className="w-4 h-4" /> Agenda
          </TabsTrigger>
          <TabsTrigger value="crm" className="rounded-xl font-black gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
            <Users className="w-4 h-4" /> Clientes/CRM
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <Wrench className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-black text-slate-900">Configurações de Serviço</h3>
            </div>
            {service && (
              <div className="mb-8">
                <PixConfigForm 
                  title="Receber via Pix"
                  description="Configure sua chave para receber pagamentos diretos por seus serviços."
                  initialConfig={service.pixConfig}
                  onSave={handleSavePix}
                />
              </div>
            )}
            <p className="text-slate-500 font-medium mb-8">
              Em breve você poderá editar suas especialidades, raio de atendimento e fotos de portfólio.
            </p>
            <div className="space-y-4">
              <div className="h-4 bg-slate-50 rounded-full w-full" />
              <div className="h-4 bg-slate-50 rounded-full w-2/3" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agenda">
          <AgendaManager merchantId={merchantId} />
        </TabsContent>

        <TabsContent value="crm">
          <CRMManager merchantId={merchantId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
