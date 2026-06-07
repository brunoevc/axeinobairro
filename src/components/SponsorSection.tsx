import { ShieldCheck, Star, Award, Building2 } from "lucide-react";

export function SponsorSection() {
  const sponsors = [
    { name: "Banco do Bairro", logo: <Building2 className="w-8 h-8" /> },
    { name: "Energia Local", logo: <Star className="w-8 h-8" /> },
    { name: "Supermercado Real", logo: <Award className="w-8 h-8" /> },
    { name: "Logística X", logo: <Building2 className="w-8 h-8" /> },
    { name: "Saúde Mais", logo: <Award className="w-8 h-8" /> },
    { name: "ConstruTech", logo: <Star className="w-8 h-8" /> },
  ];

  return (
    <section className="bg-white py-12 border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Parceiros e Apoiadores Locais
          </div>
          
          <div className="w-full overflow-hidden">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {sponsors.map((sponsor, index) => (
                <div key={index} className="flex items-center gap-3 group cursor-pointer">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-orange-500 transition-all">
                    {sponsor.logo}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-wider">
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