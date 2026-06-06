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
        <section className="bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-20 mb-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Search className="w-80 h-80 rotate-12 text-white" />
          </div>
          <div className="absolute -bottom-20 -left-20 p-12 opacity-5 pointer-events-none">
            <MapPin className="w-64 h-64 -rotate-12 text-white" />
          </div>
          
          <div className="max-w-4xl relative z-10">
            <Badge className="mb-6 bg-orange-500 hover:bg-orange-600 text-white border-none px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full">
              Portal Comunitário
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.85]">
              Tudo que você precisa, <br /><span className="text-orange-500">pertinho de você.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 font-medium max-w-2xl leading-relaxed">
              Comércio, serviços, notícias, eventos e muito mais da nossa comunidade local reunidos em um só lugar.
            </p>
            
            <form onSubmit={(e) => { e.preventDefault(); navigate({ to: '/negocios', search: { q: searchTerm } }); }} className="relative group max-w-3xl">
              <div className="flex flex-col md:flex-row gap-3 bg-white/5 p-2 rounded-[2rem] md:rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
                <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-6 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="O que você procura hoje?" 
                    className="w-full bg-transparent border-none py-5 pl-14 pr-4 text-white placeholder:text-slate-500 text-lg font-medium outline-none focus:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="hidden md:flex items-center px-6 border-l border-white/10 gap-3 group/loc cursor-pointer">
                  <MapPin className="w-5 h-5 text-slate-400 group-hover/loc:text-orange-500 transition-colors" />
                  <span className="text-slate-300 font-bold text-sm whitespace-nowrap">Araruama, RJ</span>
                </div>
                <Button type="submit" className="h-14 md:h-16 px-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-orange-500/20">
                  Buscar Agora
                </Button>
              </div>
            </form>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* ACONTECENDO AGORA (MOBILE ONLY) */}
            <section className="lg:hidden bg-slate-900 rounded-[2.5rem] p-8 text-white overflow-hidden relative group shadow-2xl">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Flame className="w-24 h-24 rotate-12 text-orange-500" />
              </div>
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Acontecendo Agora</h3>
              </div>
              <div className="space-y-6 relative z-10">
                {news.slice(0, 3).map((n, i) => (
                  <div key={n.id} className="group/item cursor-pointer flex gap-4" onClick={() => navigate({ to: '/noticias' })}>
                    <span className="text-orange-500 font-black text-xl opacity-40">0{i+1}</span>
                    <div>
                      <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] mb-1">{n.category}</p>
                      <h4 className="font-bold text-white text-sm line-clamp-2 leading-tight">{n.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* QUICK CATEGORIES */}
            <section>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Navegação Rápida</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {[
                  { label: 'Lojas', icon: Tag, path: '/negocios', color: 'bg-blue-50 text-blue-600' },
                  { label: 'Serviços', icon: Wrench, path: '/servicos', color: 'bg-orange-50 text-orange-600' },
                  { label: 'Transporte', icon: Car, path: '/transporte', color: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Ofertas', icon: Flame, path: '/negocios', color: 'bg-red-50 text-red-600' },
                  { label: 'Notícias', icon: Newspaper, path: '/noticias', color: 'bg-violet-50 text-violet-600' },
                  { label: 'Comunidade', icon: Star, path: '/noticias', color: 'bg-amber-50 text-amber-600' },
                ].map(cat => (
                  <button key={cat.label} onClick={() => navigate({ to: cat.path as any })} className="group flex flex-col items-center gap-4">
                    <div className={`w-full aspect-square rounded-[2rem] ${cat.color} flex items-center justify-center border border-transparent group-hover:border-current group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300`}>
                      <cat.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[11px] font-black uppercase text-slate-500 group-hover:text-slate-900 transition-colors tracking-widest">{cat.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* OFERTAS */}
            <section>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Ofertas do Bairro</h2>
                  <p className="text-slate-500 text-sm font-medium mt-2">As melhores oportunidades selecionadas para você hoje.</p>
                </div>
                <Button variant="ghost" onClick={() => navigate({ to: '/negocios' })} className="text-orange-600 hover:text-orange-700 font-black uppercase text-[10px] tracking-[0.2em] p-0 h-auto gap-2">
                  Ver todas as ofertas <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {promotionalMerchants.map(m => <MerchantCard key={m.id} merchant={m} />)}
              </div>
            </section>

            {/* SERVIÇOS */}
            <section>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Serviços Locais</h2>
                  <p className="text-slate-500 text-sm font-medium mt-2">Profissionais qualificados recomendados pela nossa comunidade.</p>
                </div>
                <Button variant="ghost" onClick={() => navigate({ to: '/servicos' })} className="text-orange-600 hover:text-orange-700 font-black uppercase text-[10px] tracking-[0.2em] p-0 h-auto gap-2">
                  Explorar serviços <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.map(s => (
                  <div key={s.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group cursor-pointer" onClick={() => navigate({ to: '/servicos' })}>
                    <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors shrink-0">
                      <Wrench className="w-10 h-10 text-slate-300 group-hover:text-orange-600 transition-all duration-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-slate-900 text-xl leading-tight truncate mb-1 group-hover:text-orange-600 transition-colors">{s.name}</h3>
                      <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{s.category}</p>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.neighborhood}</span>
                      </div>
                    </div>
                    <div className="ml-auto w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
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
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Representantes</h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">Lideranças que trabalham pela nossa comunidade.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {reps.map(rep => (
                  <div key={rep.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 group-hover:border-orange-500 transition-colors duration-500 shadow-inner">
                        <img src={rep.photo || "/placeholder.svg"} alt={rep.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-lg border border-slate-100 group-hover:border-orange-500 transition-colors">
                        <ShieldCheck className="w-4 h-4 text-orange-500" />
                      </div>
                    </div>
                    <h3 className="font-black text-slate-900 text-base leading-tight mb-1">{rep.name}</h3>
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-6">{rep.neighborhood}</p>
                    <Button size="sm" variant="outline" className="h-10 rounded-full text-[10px] font-black uppercase px-6 gap-2 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                      <MessageCircle className="w-3.5 h-3.5" /> Falar agora
                    </Button>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-10">
              <section className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                  <Flame className="w-40 h-40 rotate-12" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-10">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Acontecendo Agora</h3>
                  </div>
                  <div className="space-y-10">
                    {news.slice(0, 4).map((n, i) => (
                      <div key={n.id} className="group/item cursor-pointer flex gap-5" onClick={() => navigate({ to: '/noticias' })}>
                        <div className="flex flex-col items-center">
                          <span className="text-orange-500 font-black text-2xl opacity-40 group-hover/item:opacity-100 transition-all duration-300">0{i+1}</span>
                          <div className="w-px h-full bg-slate-800 mt-2" />
                        </div>
                        <div className="pb-2">
                          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2 group-hover/item:text-orange-400 transition-colors">{n.category}</p>
                          <h4 className="font-bold text-white text-base group-hover/item:text-orange-400 transition-colors line-clamp-2 leading-tight tracking-tight">{n.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="bg-orange-50 rounded-[3rem] p-10 border border-orange-100 shadow-xl relative overflow-hidden group">
                <div className="absolute -bottom-8 -right-8 p-4 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <Star className="w-40 h-40 text-orange-600" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                    <Award className="w-3.5 h-3.5" /> Destaque da Semana
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Energia Local</h3>
                  <p className="text-slate-600 text-sm font-medium mb-8 leading-relaxed">Sua conta de luz com até <span className="text-orange-600 font-black">15% de desconto</span> exclusivo para membros da comunidade.</p>
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all">Ativar Benefício</Button>
                </div>
              </section>

              <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-lg group hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-5 mb-8">
                   <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all duration-500">
                     <PlusCircle className="w-8 h-8" />
                   </div>
                   <div>
                     <h3 className="font-black text-slate-900 text-lg leading-none mb-1">Seja um Parceiro</h3>
                     <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Publicidade Local</p>
                   </div>
                </div>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">Conecte sua marca com milhares de moradores da nossa comunidade em tempo real.</p>
                <Button variant="outline" className="w-full h-14 border-slate-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Quero saber mais</Button>
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
