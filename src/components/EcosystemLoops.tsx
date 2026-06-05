import { Car, Wrench, ShoppingBag, Users, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface LoopItem {
  icon: any;
  title: string;
  description: string;
  link: string;
  label: string;
}

interface EcosystemLoopsProps {
  currentCategory?: string;
}

export function EcosystemLoops({ currentCategory }: EcosystemLoopsProps) {
  const loops: LoopItem[] = [
    {
      icon: Car,
      title: "Transporte Local",
      description: "Precisa de uma carona para chegar aqui?",
      link: "/transporte",
      label: "Ver Motoristas",
    },
    {
      icon: Wrench,
      title: "Serviços no Bairro",
      description: "Encontre profissionais qualificados perto de você.",
      link: "/servicos",
      label: "Explorar Serviços",
    },
    {
      icon: Users,
      title: "Comunidades",
      description: "Participe dos grupos e eventos da sua região.",
      link: "/comunidades",
      label: "Ver Grupos",
    },
  ];

  return (
    <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 leading-none">Explore o Ecossistema</h3>
            <p className="text-slate-500 text-xs font-medium mt-1">Mais do que uma lista, uma comunidade conectada.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loops.map((loop, index) => (
            <div key={index} className="flex flex-col p-6 bg-slate-50 rounded-3xl group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors mb-4 shadow-sm">
                <loop.icon className="w-5 h-5" />
              </div>
              <h4 className="font-black text-slate-900 mb-1">{loop.title}</h4>
              <p className="text-xs text-slate-500 font-medium mb-4 flex-1">{loop.description}</p>
              <Link to={loop.link as any} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors">
                {loop.label}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
