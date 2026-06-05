import { Users, ShoppingBag, Wrench, Car, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export function ValueProposition() {
  const navigate = useNavigate();

  const props = [
    {
      icon: Users,
      title: "Para o Morador",
      description: "Encontre tudo o que precisa no seu bairro, com segurança e rapidez.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: ShoppingBag,
      title: "Para o Negócio",
      description: "Aumente sua visibilidade e conecte-se com clientes da sua região.",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: Wrench,
      title: "Para o Profissional",
      description: "Seja encontrado por quem busca seus serviços no bairro.",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: Car,
      title: "Para a Mobilidade",
      description: "Opções de transporte local integradas ao seu dia a dia.",
      color: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">
          Um ecossistema feito <span className="text-orange-600">por pessoas para pessoas</span>
        </h2>
        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
          O Axêi no Bairro não é apenas um guia. É o motor que impulsiona a economia local e fortalece os laços da comunidade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {props.map((prop, index) => (
          <div key={index} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-14 h-14 rounded-2xl ${prop.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <prop.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">{prop.title}</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
              {prop.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-4xl font-black mb-4 leading-tight">
              Pronto para fazer parte desse <br className="hidden md:block" />
              <span className="text-orange-500">Ecossistema Digital?</span>
            </h3>
            <p className="text-slate-400 font-medium max-w-xl">
              Seja você um morador, comerciante ou apoiador, existe um lugar para você crescer conosco.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate({ to: '/planos' })}
              className="h-14 px-8 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black transition-all active:scale-95"
            >
              Ver Planos de Crescimento
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate({ to: '/como-funciona' })}
              className="h-14 px-8 bg-transparent border-white/20 text-white hover:bg-white/10 rounded-2xl font-black transition-all"
            >
              Como Funciona
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
