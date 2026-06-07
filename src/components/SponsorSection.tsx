import { ShieldCheck, Star, Award, Building2 } from "lucide-react";

export function SponsorSection() {
  const sponsors = [
    { name: "Banco do Bairro", logo: <Building2 className="w-12 h-12" />, description: "Patrocinador Master" },
    { name: "Energia Local", logo: <Star className="w-12 h-12" />, description: "Inovação e Sustentabilidade" },
    { name: "Supermercado Real", logo: <Award className="w-12 h-12" />, description: "Apoio à Economia Local" },
    { name: "Logística X", logo: <Building2 className="w-12 h-12" />, description: "Infraestrutura" },
  ];

  return (
    <section className="bg-white py-24 relative overflow-hidden border-t border-slate-100">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
      </div>
      
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 py-16">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-orange-100">
              <ShieldCheck className="h-4 w-4" />
              Parceiros Estratégicos
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
              Marcas que <span className="text-orange-500 italic">impulsionam</span> o bairro.
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Instituições que acreditam e investem no crescimento sustentável da nossa economia local.
            </p>
          </div>

          <div className="flex-1 w-full overflow-hidden">
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-12 md:gap-20 opacity-60 hover:opacity-100 transition-opacity duration-700">
              {sponsors.map((sponsor, index) => (
                <div key={index} className="flex flex-col items-center group cursor-pointer">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 font-black text-4xl group-hover:bg-white group-hover:border-orange-500 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow-xl">
                    {sponsor.logo}
                  </div>
                  <span className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-slate-900 transition-colors">
                    {sponsor.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}