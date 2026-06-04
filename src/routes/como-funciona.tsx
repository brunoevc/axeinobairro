import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Search, Wrench, Car, Newspaper, ChevronRight, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/como-funciona")({
  component: ComoFunciona,
  head: () => ({
    meta: [
      { title: "Como Funciona | Axêi no Bairro" },
      { name: "description", content: "Entenda como o Axêi no Bairro conecta você aos negócios, serviços e notícias da sua região." }
    ],
  }),
});

function ComoFunciona() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <TopBar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
            Tudo o que acontece no seu bairro <br className="hidden md:block" /> em um só lugar
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Encontre comércios, serviços, transporte, notícias e oportunidades locais.
          </p>
        </header>

        <div className="space-y-16">
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <User className="w-8 h-8 text-orange-600" /> Para Moradores
            </h2>
            <ul className="grid md:grid-cols-2 gap-6 text-slate-600 font-medium">
              {[
                "Encontrar lojas locais",
                "Encontrar profissionais",
                "Encontrar transporte alternativo",
                "Acompanhar notícias do bairro",
                "Ver eventos locais"
              ].map(item => (
                <li key={item} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <ChevronRight className="w-5 h-5 text-orange-600" /> {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild className="h-14 px-8 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black">
                <Link to="/negocios">Explorar o Bairro</Link>
              </Button>
            </div>
          </section>

          <section className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] text-white">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-orange-500">
              <ShoppingBag className="w-8 h-8" /> Para Negócios
            </h2>
            <ul className="grid md:grid-cols-2 gap-6 text-slate-300 font-medium">
              {[
                "Perfil profissional",
                "WhatsApp direto",
                "Promoções",
                "Avaliações",
                "Destaques locais"
              ].map(item => (
                <li key={item} className="flex items-center gap-3 p-4 bg-slate-800 rounded-2xl">
                  <ChevronRight className="w-5 h-5 text-orange-500" /> {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild className="h-14 px-8 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black">
                <Link to="/cadastro">Anunciar meu Negócio</Link>
              </Button>
            </div>
          </section>

          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-orange-600" /> Para Representantes
            </h2>
            <p className="text-slate-600 font-medium mb-8 text-lg">
              Conecte moradores, apoie negócios locais, divulgue oportunidades e fortaleça sua comunidade.
            </p>
            <Button asChild variant="outline" className="h-14 px-8 border-2 border-slate-200 rounded-2xl font-black">
              <Link to="/representantes">Quero ser Representante</Link>
            </Button>
          </section>
        </div>
      </main>
      <FloatingNav />
    </div>
  );
}
