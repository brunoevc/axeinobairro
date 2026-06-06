import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { 
  Search, 
  ChevronRight, 
  Flame, 
  Tag,
  Star,
  Newspaper,
  Calendar,
  Wrench,
  Car,
  Croissant,
  PawPrint,
  MapPin,
  ArrowUpRight,
  PlusCircle,
  ShieldCheck,
  Award,
  Users,
  MessageCircle
} from "lucide-react";

import { merchantsRepository } from "@/repositories/merchantsRepository";
import { servicesRepository } from "@/repositories/servicesRepository";
import { newsRepository } from "@/repositories/newsRepository";
import { representativesRepository } from "@/repositories/representativesRepository";
import { MerchantCard } from "@/components/MerchantCard";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "@/hooks/useLocation";
import { Footer } from "@/components/Footer";
import { SponsorSection } from "@/components/SponsorSection";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Axêi no Bairro — Portal da Sua Comunidade" },
      { name: "description", content: "Tudo que você precisa, pertinho de você. Comércio, serviços, notícias e eventos da nossa comunidade." },
    ],
  }),
});

function Index() {
  const navigate = useNavigate();
  const [merchants, setMerchants] = useState(() => merchantsRepository.getAll());
  const [searchTerm, setSearchTerm] = useState("");
  const services = useMemo(() => servicesRepository.getAll().slice(0, 4), []);
  const reps = useMemo(() => representativesRepository.getAll().slice(0, 4), []);
  const news = useMemo(() => newsRepository.getAll(), []);
  
  useEffect(() => {
    const unsubscribe = merchantsRepository.subscribe(() => setMerchants(merchantsRepository.getAll()));
    return () => unsubscribe();
  }, []);

  const promotionalMerchants = useMemo(() => merchants.filter(m => m.promotion.isActive).slice(0, 4), [merchants]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100">
      <TopBar />
      
      <main className="max-w-[1440px] mx-auto pt-6 px-4 md:px-6 pb-24">
        {/* HERO */}
        <section className="bg-white rounded-[2.5rem] p-6 md:p-12 mb-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Search className="w-64 h-64 rotate-12" />
          </div>
          <div className="max-w-3xl relative z-10">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4 leading-[0.9]">
              Tudo que você precisa, <br /><span className="text-orange-600">pertinho de você.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-8 font-medium">
              Comércio, serviços, notícias, eventos e muito mais da nossa comunidade.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); navigate({ to: '/negocios', search: { q: searchTerm } }); }} className="relative group max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar comércios, serviços ou eventos..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-14 pr-32 text-base font-medium outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-lg shadow-slate-100/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-8 bg-slate-900 hover:bg-slate-800 rounded-xl font-black text-xs uppercase tracking-widest transition-transform active:scale-95">Buscar</Button>
            </form>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 flex flex-col gap-16">
            
            {/* QUICK CATEGORIES */}
            <section>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Categorias Rápidas</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {[
                  { label: 'Lojas', icon: Tag, path: '/negocios' },
                  { label: 'Serviços', icon: Wrench, path: '/servicos' },
                  { label: 'Transporte', icon: Car, path: '/transporte' },
                  { label: 'Ofertas', icon: Flame, path: '/negocios' },
                  { label: 'Notícias', icon: Newspaper, path: '/noticias' },
                  { label: 'Comunidade', icon: Star, path: '/noticias' },
                ].map(cat => (
                  <button key={cat.label} onClick={() => navigate({ to: cat.path as any })} className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-3 hover:border-orange-200 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                      <cat.icon className="w-6 h-6 text-slate-600 group-hover:text-orange-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-orange-600">{cat.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* OFERTAS */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Ofertas do Bairro</h2>
                  <p className="text-slate-500 text-sm font-medium">As melhores oportunidades perto de você.</p>
                </div>
                <Button variant="outline" onClick={() => navigate({ to: '/negocios' })} className="border-slate-200 text-slate-600 font-black uppercase text-[10px] rounded-xl px-6">Ver tudo</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {promotionalMerchants.map(m => <MerchantCard key={m.id} merchant={m} />)}
              </div>
            </section>

            {/* SERVIÇOS */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Serviços da Comunidade</h2>
                  <p className="text-slate-500 text-sm font-medium">Profissionais recomendados pelos seus vizinhos.</p>
                </div>
                <Button variant="outline" onClick={() => navigate({ to: '/servicos' })} className="border-slate-200 text-slate-600 font-black uppercase text-[10px] rounded-xl px-6">Todos os serviços</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map(s => (
                  <div key={s.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all group cursor-pointer" onClick={() => navigate({ to: '/servicos' })}>
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors shrink-0">
                      <Wrench className="w-8 h-8 text-slate-400 group-hover:text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-slate-900 text-lg leading-tight truncate">{s.name}</h3>
                      <p className="text-orange-600 text-[10px] font-black uppercase tracking-widest">{s.category}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400">{s.neighborhood}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-200 ml-auto group-hover:text-orange-600 transition-colors" />
                  </div>
                ))}
              </div>
            </section>

            {/* AGENDA + NOTÍCIAS */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-600" /> Agenda Local
                  </h2>
                  <div className="space-y-4">
                    {news.filter(n => n.category === 'eventos').slice(0, 3).map(event => (
                      <div key={event.id} className="flex gap-4 group cursor-pointer" onClick={() => navigate({ to: '/noticias' })}>
                        <div className="bg-orange-50 text-orange-600 w-12 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                          <span className="text-lg font-black leading-none">15</span>
                          <span className="text-[8px] font-black uppercase tracking-tighter">JUN</span>
                        </div>
                        <div className="pt-1">
                          <h4 className="font-black text-slate-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-2">{event.title}</h4>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> Araruama, RJ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
               <div>
                  <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-orange-600" /> Notícias
                  </h2>
                  <div className="space-y-6">
                    {news.filter(n => n.category !== 'eventos').slice(0, 3).map(n => (
                      <div key={n.id} className="group cursor-pointer" onClick={() => navigate({ to: '/noticias' })}>
                        <span className="text-[8px] font-black uppercase text-orange-600 mb-1 block">{n.category}</span>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors leading-tight">{n.title}</h4>
                      </div>
                    ))}
                  </div>
               </div>
            </section>

            {/* REPRESENTANTES */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Representantes</h2>
                  <p className="text-slate-500 text-sm font-medium">Lideranças que trabalham pelo nosso bairro.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {reps.map(rep => (
                  <div key={rep.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center hover:shadow-lg transition-all group">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-slate-100 group-hover:border-orange-500 transition-colors">
                      <img src={rep.photo || "/placeholder.svg"} alt={rep.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="font-black text-slate-900 text-sm leading-tight mb-1">{rep.name}</h3>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">{rep.neighborhood}</p>
                    <Button size="sm" variant="outline" className="h-8 rounded-full text-[9px] font-black uppercase px-4 gap-1.5 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200">
                      <MessageCircle className="w-3 h-3" /> Contato
                    </Button>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-8">
              <section className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <Flame className="w-32 h-32 rotate-12" />
                </div>
                <h3 className="text-[10px] font-black uppercase text-slate-400 mb-8 tracking-[0.2em] relative z-10">Acontecendo Agora</h3>
                <div className="space-y-8 relative z-10">
                  {news.slice(0, 4).map((n, i) => (
                    <div key={n.id} className="group/item cursor-pointer flex gap-4" onClick={() => navigate({ to: '/noticias' })}>
                      <span className="text-orange-500 font-black text-xl opacity-50 group-hover/item:opacity-100 transition-opacity">0{i+1}</span>
                      <div>
                        <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mb-1 group-hover/item:text-orange-400 transition-colors">{n.category}</p>
                        <h4 className="font-bold text-white text-sm group-hover/item:text-orange-400 transition-colors line-clamp-2 leading-snug">{n.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-orange-50 rounded-[3rem] p-8 border border-orange-100 shadow-sm relative overflow-hidden group">
                <div className="absolute -bottom-8 -right-8 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Star className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6">
                    <Award className="w-3 h-3" /> Patrocinador
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Energia Local</h3>
                  <p className="text-slate-600 text-xs font-medium mb-6 leading-relaxed">Pague sua conta de luz com 10% de desconto no Axêi.</p>
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 rounded-2xl">Aproveitar agora</Button>
                </div>
              </section>

              <section className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                     <PlusCircle className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="font-black text-slate-900 text-sm">Seja um Parceiro</h3>
                     <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Publicidade Local</p>
                   </div>
                </div>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">Destaque sua empresa para milhares de moradores em tempo real.</p>
                <Button variant="outline" className="w-full border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest py-6">Saiba mais</Button>
              </section>
            </div>
          </aside>
        </div>

        <SponsorSection />
      </main>
      <Footer />
      <FloatingNav />
    </div>
  );
}
