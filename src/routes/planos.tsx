import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Check, Star, Users, Briefcase, Building2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/planos")({
  component: Planos,
});

function Planos() {
  const whatsappUrl = "https://wa.me/5522999999999?text=Olá, quero falar com um representante sobre os planos do Axêi no Bairro.";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <TopBar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-12 text-center">Planos e Benefícios</h1>

        <div className="space-y-16">
          {/* Moradores */}
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Users className="text-orange-600" /> Moradores</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h3 className="font-black text-lg mb-2">Gratuito</h3>
                <ul className="text-sm font-medium text-slate-600 space-y-2 mb-6">
                  <li>• Até 3 anúncios</li>
                  <li>• 1 foto</li>
                  <li>• 15 dias de duração</li>
                </ul>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl text-white">
                <h3 className="font-black text-lg mb-2 text-orange-500">Bairro+</h3>
                <p className="text-2xl font-black mb-4">R$ 14,90</p>
                <ul className="text-sm font-medium text-slate-300 space-y-2 mb-6">
                  <li>• Até 20 anúncios</li>
                  <li>• Até 5 fotos</li>
                  <li>• Selo Verificado</li>
                  <li>• Destaque nos classificados</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Negócios */}
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Briefcase className="text-orange-600" /> Negócios</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h3 className="font-black text-lg mb-2">Gratuito</h3>
                <p className="text-sm text-slate-500 mb-6">Perfil básico e WhatsApp.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-orange-500">
                <h3 className="font-black text-lg mb-2 text-orange-600">Destaque</h3>
                <p className="text-2xl font-black mb-4">R$ 47</p>
                <ul className="text-sm font-medium text-slate-600 space-y-2 mb-6">
                  <li>• Selo Verificado</li>
                  <li>• Catálogo ampliado</li>
                  <li>• Entrega por bairro</li>
                </ul>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl text-white">
                <h3 className="font-black text-lg mb-2 text-orange-500">Premium</h3>
                <p className="text-2xl font-black mb-4">R$ 97</p>
                <ul className="text-sm font-medium text-slate-300 space-y-2 mb-6">
                  <li>• Tudo do Destaque</li>
                  <li>• Campanhas locais</li>
                  <li>• Agenda Profissional</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Profissionais Autônomos */}
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Star className="text-orange-600" /> Profissionais</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-900 p-6 rounded-2xl text-white">
                <h3 className="font-black text-lg mb-2 text-blue-400">Premium</h3>
                <p className="text-2xl font-black mb-4">R$ 97</p>
                <ul className="text-sm font-medium text-slate-300 space-y-2 mb-6">
                  <li>• Perfil Verificado Premium</li>
                  <li>• Agenda de Atendimentos</li>
                  <li>• Histórico de Serviços</li>
                </ul>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl text-white border-2 border-orange-500 relative">
                <div className="absolute -top-3 right-4 bg-orange-500 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase">Melhor Valor</div>
                <h3 className="font-black text-lg mb-2 text-orange-500">Premium+</h3>
                <p className="text-2xl font-black mb-4">R$ 147</p>
                <ul className="text-sm font-medium text-slate-300 space-y-2 mb-6">
                  <li>• Tudo do Premium</li>
                  <li>• Gestão de Clientes (CRM)</li>
                  <li>• Pipeline de Vendas</li>
                  <li>• Métricas de Conversão</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Transporte */}
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Building2 className="text-orange-600" /> Transporte</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h3 className="font-black text-lg mb-2">Básico</h3>
                <p className="text-sm text-slate-500 mb-6">Presença na lista de motoristas e contato via WhatsApp.</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl text-white">
                <h3 className="font-black text-lg mb-2 text-emerald-400">Premium</h3>
                <p className="text-2xl font-black mb-4">R$ 97</p>
                <ul className="text-sm font-medium text-slate-300 space-y-2 mb-6">
                  <li>• Corridas Agendadas</li>
                  <li>• Gestão de Clientes Recorrentes</li>
                  <li>• Histórico Completo</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 text-center">
          <Button asChild className="h-14 px-8 rounded-2xl font-black bg-orange-600 hover:bg-orange-700">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Quero falar com um representante <ChevronRight className="ml-2 w-5 h-5" /></a>
          </Button>
        </div>
      </main>
      <FloatingNav />
    </div>
  );
}
