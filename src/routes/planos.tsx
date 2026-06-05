import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { 
  Check, 
  Star, 
  Users, 
  Briefcase, 
  Building2, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  MessageCircle,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { intentTracker } from "@/utils/intent-tracker";
import { EconomicCategory, Territory, PlanType } from "@/types/business-intelligence";

export const Route = createFileRoute("/planos")({
  component: Planos,
});

function Planos() {
  const whatsappUrl = "https://wa.me/5521999869070?text=Olá, quero saber mais sobre como crescer meu negócio no ecossistema Axêi no Bairro.";

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <TopBar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <header className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-100 shadow-sm">
            <TrendingUp className="h-3 w-3" />
            Cresça com o Ecossistema
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
            Escolha seu nível de <br className="hidden md:block" />
            <span className="text-orange-600">presença e impacto</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Seja você um morador ativo, um negócio local ou um grande parceiro, temos o plano ideal para você crescer conosco.
          </p>
        </header>

        {/* Planos para Negócios & Serviços */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-none">Negócios & Serviços</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Para quem quer vender mais e ser referência no bairro.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Gratuito */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-black text-slate-900 mb-2">Básico</h3>
                <div className="text-3xl font-black text-slate-900">Grátis</div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Sempre gratuito</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3 text-sm font-medium text-slate-600">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  Perfil básico no diretório
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-600">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  Botão de WhatsApp direto
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-600">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  Localização no mapa
                </li>
              </ul>
              <Button asChild variant="outline" className="h-14 rounded-2xl font-black border-slate-200">
                <Link to="/cadastro">Começar agora</Link>
              </Button>
            </div>

            {/* Destaque */}
            <div className="bg-white p-8 rounded-[2.5rem] border-4 border-orange-500 shadow-xl shadow-orange-100 flex flex-col relative scale-105 z-10">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Mais Procurado</div>
              <div className="mb-8">
                <h3 className="text-xl font-black text-orange-600 mb-2">Destaque</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-slate-400">R$</span>
                  <span className="text-4xl font-black text-slate-900">47</span>
                  <span className="text-sm font-bold text-slate-400">/mês</span>
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Mais Visibilidade Local</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3 text-sm font-black text-slate-900">
                  <Zap className="w-5 h-5 text-orange-500 shrink-0" />
                  Destaque na página inicial
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-600">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  Selo de Verificado
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-600">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  Catálogo de produtos/serviços
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-600">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  Relatório de Cliques Mensal
                </li>
              </ul>
              <Button 
                className="h-14 rounded-2xl font-black bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200"
                onClick={() => {
                  intentTracker.track({
                    type: 'click_plan',
                    planId: 'Destaque' as PlanType,
                    source: 'planos',
                    category: 'outros' as EconomicCategory,
                    territory: 'Araruama' as Territory
                  });
                  window.open(whatsappUrl, '_blank');
                }}
              >
                Assinar Destaque
              </Button>
            </div>

            {/* Premium */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] flex flex-col text-white">
              <div className="mb-8">
                <h3 className="text-xl font-black text-violet-400 mb-2">Premium</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-slate-500">R$</span>
                  <span className="text-4xl font-black">97</span>
                  <span className="text-sm font-bold text-slate-500">/mês</span>
                </div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Mais Gestão e Vendas</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3 text-sm font-black text-violet-400">
                  <Crown className="w-5 h-5 shrink-0" />
                  Tudo do plano Destaque
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  Agenda Profissional Integrada
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  Campanhas de Notificações
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-300">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  Consultoria de Presença Digital
                </li>
              </ul>
              <Button asChild className="h-14 rounded-2xl font-black bg-white text-slate-900 hover:bg-slate-100">
                <a href={whatsappUrl}>Quero ser Premium</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Patrocinadores e Apoiadores */}
        <section className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-sm relative overflow-hidden mb-24">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-violet-100 shadow-sm">
                <ShieldCheck className="h-3 w-3" />
                Autoridade Institucional
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">
                Seja um <span className="text-violet-600">Patrocinador do Bairro</span>
              </h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
                Posicione sua marca no coração da comunidade. Apoie o desenvolvimento local e ganhe visibilidade institucional máxima em todos os módulos do Axêi.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  "Banner fixo em todas as páginas",
                  "Selo de Patrocinador Oficial",
                  "Menção em todas as comunicações",
                  "Módulo exclusivo de novidades"
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Check className="w-4 h-4 text-violet-500" /> {item}
                  </div>
                ))}
              </div>
              <Button asChild className="h-16 px-10 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-violet-100">
                <a href={whatsappUrl}>Falar com um Representante</a>
              </Button>
            </div>
            <div className="w-full max-w-sm">
               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exposição</div>
                    <div className="text-sm font-bold text-slate-900 leading-tight">Sua marca para +15.000 moradores mensais.</div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Autoridade</div>
                    <div className="text-sm font-bold text-slate-900 leading-tight">Reconhecimento como motor do bairro.</div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impacto</div>
                    <div className="text-sm font-bold text-slate-900 leading-tight">Fortalecimento real do comércio local.</div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Planos para Moradores */}
        <section className="mb-24">
          <div className="text-center mb-12">
             <h2 className="text-2xl font-black text-slate-900 mb-2">Planos para Moradores</h2>
             <p className="text-slate-500 font-medium">Participe ativamente da economia do seu bairro.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-2">Bairro Livre</h3>
                <div className="text-2xl font-black text-slate-900 mb-6">Grátis</div>
                <ul className="space-y-4 mb-8">
                   <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <Check className="w-5 h-5 text-emerald-500" /> 1 anúncio nos classificados
                   </li>
                   <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <Check className="w-5 h-5 text-emerald-500" /> Perfil de morador básico
                   </li>
                </ul>
                <Button asChild variant="outline" className="w-full h-12 rounded-xl font-black border-slate-200">
                   <Link to="/cadastro">Começar grátis</Link>
                </Button>
             </div>
             <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                <h3 className="text-xl font-black text-orange-500 mb-2">Bairro+</h3>
                <div className="flex items-baseline gap-1 mb-6">
                   <span className="text-3xl font-black">R$ 14,90</span>
                   <span className="text-sm font-bold text-slate-500">/mês</span>
                </div>
                <ul className="space-y-4 mb-8">
                   <li className="flex items-center gap-3 text-sm font-medium text-slate-300">
                      <Check className="w-5 h-5 text-orange-500" /> Anúncios ilimitados
                   </li>
                   <li className="flex items-center gap-3 text-sm font-medium text-slate-300">
                      <Check className="w-5 h-5 text-orange-500" /> Destaque visual nos anúncios
                   </li>
                   <li className="flex items-center gap-3 text-sm font-medium text-slate-300">
                      <Check className="w-5 h-5 text-orange-500" /> Selo "Morador Apoiador"
                   </li>
                </ul>
                <Button asChild className="w-full h-12 rounded-xl font-black bg-orange-600 hover:bg-orange-700">
                   <a href={whatsappUrl}>Ser Bairro+</a>
                </Button>
             </div>
          </div>
        </section>

        {/* Seção para Representantes */}
        <section className="text-center bg-slate-100 p-12 md:p-20 rounded-[4rem]">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">
            Trabalhe com o Axêi no <span className="text-orange-600">Seu Bairro</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Seja um representante oficial, ajude a digitalizar os negócios da sua região e construa uma renda recorrente sólida.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="h-16 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg shadow-xl">
              <Link to="/representantes-programa">Saber mais sobre o Programa</Link>
            </Button>
            <Button asChild variant="ghost" className="h-16 px-10 font-black text-slate-600 hover:text-orange-600">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> Falar com Consultor
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingNav />
    </div>
  );
}
