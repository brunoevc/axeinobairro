import { ShieldCheck, Star, Award } from "lucide-react";

export function SponsorSection() {
  const sponsors = [
    { name: "Banco do Bairro", logo: "BB", description: "Patrocinador Master" },
    { name: "Energia Local", logo: "EL", description: "Inovação e Sustentabilidade" },
    { name: "Supermercado Real", logo: "SR", description: "Apoio à Economia Local" },
  ];

  return (
    <section className="bg-slate-50 py-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-violet-100 shadow-sm">
            <ShieldCheck className="h-3 w-3" />
            Autoridade Institucional
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">
            Patrocinadores <span className="text-violet-600">Oficiais</span>
          </h2>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Grandes empresas que investem no desenvolvimento tecnológico e social da nossa comunidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <Award className="w-16 h-16 text-violet-600" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-6 font-black text-2xl group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm">
                {sponsor.logo}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">{sponsor.name}</h3>
              <p className="text-violet-600 text-xs font-black uppercase tracking-widest mb-4">{sponsor.description}</p>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Star className="w-3.5 h-3.5 fill-violet-100 text-violet-200" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Parceiro Estratégico</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm font-medium mb-6 italic">
            "O Axêi no Bairro é a ponte que precisávamos para estar mais próximos dos nossos clientes locais."
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-12 bg-slate-200 rounded-full" />
            <div className="h-1 w-4 bg-violet-600 rounded-full" />
            <div className="h-1 w-12 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
