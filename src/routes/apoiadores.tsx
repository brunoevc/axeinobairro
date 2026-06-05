import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Building2 } from "lucide-react";

export const Route = createFileRoute("/apoiadores")({
  component: Apoiadores,
});

function Apoiadores() {
  const categories = ["Saúde", "Educação", "Alimentação", "Serviços", "Esporte", "Mobilidade"];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <TopBar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 text-center">Apoiadores da Comunidade</h1>
        <p className="text-lg text-slate-500 text-center mb-12">Empresas que acreditam no crescimento do nosso bairro.</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div key={cat} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg">{cat}</h3>
            </div>
          ))}
        </div>
      </main>
      <FloatingNav />
    </div>
  );
}
