import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { representativesRepository } from "@/repositories/representativesRepository";
import { Representative } from "@/types/representatives";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/TopBar";
import { Phone, MessageSquare, MapPin, User, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/representantes")({
  component: RepresentativesPage,
});

function RepresentativesPage() {
  const [reps, setReps] = useState<Representative[]>([]);

  useEffect(() => {
    setReps(representativesRepository.getAll().filter(r => r.isActive));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-12">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-orange-600 font-bold mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Home
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Representantes Locais</h1>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl leading-relaxed">
            Representantes ajudam a conectar moradores, comerciantes e oportunidades locais, fortalecendo o bairro e a economia da comunidade.
          </p>
          <div className="h-1.5 w-20 bg-orange-600 mt-6 rounded-full" />
          
          <div className="mt-8">
            <Button asChild className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black shadow-lg">
              <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer">
                Quero ser Representante
              </a>
            </Button>
          </div>

        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reps.map(rep => (
            <div key={rep.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-orange-100 group-hover:border-orange-500 transition-colors">
                  {rep.photo ? (
                    <img src={rep.photo} alt={rep.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-slate-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{rep.name}</h3>
                  <p className="text-orange-600 font-bold text-sm">{rep.role}</p>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                    <MapPin className="w-3 h-3" />
                    {rep.city}{rep.neighborhood ? ` • ${rep.neighborhood}` : ""}
                  </div>
                </div>
              </div>
              
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                {rep.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  asChild
                  variant="outline"
                  className="rounded-xl border-slate-200 font-bold text-xs"
                >
                  <a href={`tel:${rep.phone}`}>
                    <Phone className="w-3 h-3 mr-2" />
                    Ligar
                  </a>
                </Button>
                <Button 
                  asChild
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
                >
                  <a href={`https://wa.me/${rep.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="w-3 h-3 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}