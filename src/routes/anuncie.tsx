import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/anuncie")({
  component: Anuncie,
  head: () => ({
    meta: [
      { title: "Anuncie | Axêi no Bairro" },
      { name: "description", content: "Divulgue seu negócio para moradores da sua região com o Axêi no Bairro." }
    ],
  }),
});

function Anuncie() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <TopBar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
            Leve seu negócio para mais <br className="hidden md:block" /> moradores do bairro
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Receba contatos diretamente pelo WhatsApp.
          </p>
        </header>

        <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm mb-12">
          <h2 className="text-2xl font-black text-slate-900 mb-8">Por que anunciar no Axêi?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Perfil público profissional",
              "Divulgação 100% local",
              "Promoções em destaque",
              "Avaliações de clientes",
              "Destaques Premium"
            ].map(item => (
              <div key={item} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl font-bold text-slate-700">
                <Check className="w-5 h-5 text-emerald-500" /> {item}
              </div>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-sm">
            <h3 className="text-xl font-black mb-4">Plano Gratuito</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2 font-medium text-slate-600"><Check className="w-4 h-4 text-emerald-500"/> Perfil básico</li>
              <li className="flex items-center gap-2 font-medium text-slate-600"><Check className="w-4 h-4 text-emerald-500"/> WhatsApp direto</li>
              <li className="flex items-center gap-2 font-medium text-slate-600"><Check className="w-4 h-4 text-emerald-500"/> Informações da empresa</li>
            </ul>
            <Button asChild className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black">
              <Link to="/cadastro">Cadastrar meu Negócio</Link>
            </Button>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
            <h3 className="text-xl font-black mb-4 text-orange-500 flex items-center gap-2">
              <Star className="w-5 h-5 fill-orange-500" /> Planos Pagos
            </h3>
            <p className="text-slate-400 mb-8 font-medium italic text-sm leading-relaxed">Turbine sua visibilidade com selos de verificação, destaque nas buscas e entrega local.</p>
            <ul className="space-y-4 mb-8 text-slate-300 font-medium">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-500"/> Destaque nas Buscas</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-500"/> Selo Verificado</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-500"/> Prioridade no Bairro</li>
            </ul>
            <Button asChild className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black transition-all">
              <Link to="/planos">Ver todos os Planos</Link>
            </Button>
          </div>
        </div>

        <section className="text-center bg-slate-100 p-8 rounded-[2.5rem]">
          <h2 className="text-2xl font-black mb-4">Seja um Representante Local</h2>
          <p className="text-slate-600 font-medium mb-6">Ajude a crescer o comércio do seu bairro e ganhe comissões recorrentes.</p>
          <Button asChild variant="outline" className="border-slate-300 rounded-2xl font-black h-12 px-8">
            <Link to="/representantes-programa">Saber mais sobre o Programa</Link>
          </Button>
        </section>

      </main>
      <FloatingNav />
    </div>
  );
}
