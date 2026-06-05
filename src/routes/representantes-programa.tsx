import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/representantes-programa")({
  component: Representantes,
});

function Representantes() {
  const whatsappUrl = "https://wa.me/5522999999999?text=Olá, quero me candidatar ao programa de representantes.";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <TopBar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-8">Programa de Representantes</h1>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 mb-12">
          <h2 className="text-xl font-black">Como funciona</h2>
          <p className="text-slate-600 font-medium">Torne-se a referência do Axêi na sua região. Você será o rosto da nossa plataforma junto aos comerciantes locais.</p>
          
          <h2 className="text-xl font-black">O que você ganha</h2>
          <p className="text-slate-600 font-medium">Comissão recorrente por contratos ativos.</p>
          
          <h2 className="text-xl font-black">Quem pode participar</h2>
          <p className="text-slate-600 font-medium">Lideranças locais, comerciantes ativos e empreendedores com visão comunitária.</p>
        </div>

        <div className="text-center">
          <Button asChild className="h-14 px-8 rounded-2xl font-black bg-slate-900 hover:bg-slate-800">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Quero ser representante</a>
          </Button>
        </div>
      </main>
      <FloatingNav />
    </div>
  );
}
