import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { SponsorSection } from "@/components/SponsorSection";
import { Building2, Award, Star, ShieldCheck, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/apoiadores")({
  component: Apoiadores,
});

function Apoiadores() {
  const categories = ["Saúde", "Educação", "Alimentação", "Serviços", "Esporte", "Mobilidade"];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <TopBar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <header className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-100 shadow-sm">
            <Award className="h-3 w-3" />
            Ecossistema de Confiança
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
            Autoridade e <br className="hidden md:block" />
            <span className="text-orange-600">Impacto na Comunidade</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Conheça as empresas e instituições que fazem o Axêi no Bairro acontecer todos os dias.
          </p>
        </header>

        {/* Patrocinadores Oficiais Section */}
        <SponsorSection />

        {/* Prova Social Section */}
        <section className="py-24 border-y border-slate-100 my-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Negócios Locais", value: "250+", icon: Building2 },
              { label: "Usuários Ativos", value: "15k+", icon: Users },
              { label: "Bairros Atendidos", value: "12", icon: ShieldCheck },
              { label: "Crescimento Mensal", value: "25%", icon: TrendingUp },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl md:text-5xl font-black text-slate-900 mb-1">{stat.value}</div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Apoiadores por Categoria */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-none">Apoiadores da Comunidade</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">Empresas locais que apoiam o desenvolvimento do bairro.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(cat => (
              <div key={cat} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group">
                <div className="bg-slate-50 p-3 rounded-xl text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-black text-slate-700">{cat}</h3>
                   <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest opacity-50">Apoiador Local</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA para se tornar parceiro */}
        <section className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-600/20 rounded-full blur-[80px] -ml-32 -mt-32" />
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter relative z-10">
            Sua empresa quer ser <br className="hidden md:block" />
            <span className="text-orange-500">protagonista no bairro?</span>
          </h2>
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed relative z-10">
            Entre em contato com nosso time comercial e descubra as cotas de patrocínio e apoio institucional.
          </p>
          <Button asChild className="h-16 px-10 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-lg shadow-xl relative z-10">
            <a href="https://wa.me/5521999869070?text=Olá, quero saber mais sobre as cotas de patrocínio do Axêi no Bairro.">Ser um Patrocinador</a>
          </Button>
        </section>
      </main>

      <Footer />
      <FloatingNav />
    </div>
  );
}
