import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { 
  Search, 
  ArrowRight, 
  PlusCircle,
  Tag,
  Star,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  Navigation,
  Croissant,
  Bike,
  PawPrint,
  RefreshCw,
   Briefcase,
   Car,
   Lock,
   ArrowLeft,
   ShoppingBag,
   Wrench,
   Newspaper,
    Users,
    MessageCircle,
    Sparkles,
    Calendar,
    ArrowUpRight,
    SearchCheck,
    LayoutGrid,
    Flame,
    ArrowRightCircle,
    CheckCircle2,
    Store,
    User
  } from "lucide-react";

import { categories } from "@/data/merchants";
import { merchantsRepository } from "@/repositories/merchantsRepository";
import { servicesRepository } from "@/repositories/servicesRepository";
import { ridesRepository } from "@/repositories/ridesRepository";
import { localBoostsRepository } from "@/repositories/localBoostsRepository";
import { newsRepository } from "@/repositories/newsRepository";
import { representativesRepository } from "@/repositories/representativesRepository";
import { recommendationsRepository } from "@/repositories/recommendationsRepository";
import { LocalBoost } from "@/types/boosts";
import { Recommendation } from "@/types/recommendations";

import { MerchantCard } from "@/components/MerchantCard";
import { MerchantSkeleton } from "@/components/MerchantSkeleton";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import { useLocation } from "@/hooks/useLocation";
import { Footer } from "@/components/Footer";
import { ValueProposition } from "@/components/ValueProposition";
import { SponsorSection } from "@/components/SponsorSection";
import { intentTracker } from "@/utils/intent-tracker";
import { EconomicCategory, Territory } from "@/types/business-intelligence";

const IS_ADMIN_ENABLED = import.meta.env.VITE_ADMIN_ENABLED === 'true';

export const Route = createFileRoute("/")({
  component: Index,

  head: () => ({
    meta: [
      { title: "Axêi no Bairro — Marketplace Local" },
      {
        name: "description",
        content: "Encontre os melhores comércios, serviços e promoções no seu bairro.",
      },
    ],
  }),
});

function Index() {
  const navigate = useNavigate();
  const { coords, getDistance, loading: locationLoading } = useLocation();
  const [merchants, setMerchants] = useState(() => merchantsRepository.getAll());
  const services = useMemo(() => servicesRepository.getAll(), []);
  const rides = useMemo(() => ridesRepository.list(), []);
  const activeBoosts = useMemo(() => localBoostsRepository.getActiveBoosts(), []);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => recommendationsRepository.getActive().slice(0, 3));

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = merchantsRepository.subscribe(() => setMerchants(merchantsRepository.getAll()));
    const timer = setTimeout(() => setIsLoading(false), 800);
    const unsubscribeRecs = recommendationsRepository.subscribe(() => setRecommendations(recommendationsRepository.getActive().slice(0, 3)));

    return () => {
      unsubscribe();
      unsubscribeRecs();
      clearTimeout(timer);
    };
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      navigate({ to: '/negocios', search: { q: searchTerm.trim() } });
      intentTracker.track({ type: 'search', source: 'home', category: 'alimentacao' as EconomicCategory, territory: 'Araruama' as Territory });
    } else {
      navigate({ to: '/negocios' });
    }
  };

  const levelAMerchants = useMemo(() => merchants.filter(m => m.exposureLevel === 'A'), [merchants]);
  const levelBMerchants = useMemo(() => merchants.filter(m => m.exposureLevel === 'B' && !levelAMerchants.some(a => a.id === m.id)), [merchants, levelAMerchants]);
  const levelCMerchants = useMemo(() => merchants.filter(m => m.exposureLevel === 'C' && !levelAMerchants.some(a => a.id === m.id) && !levelBMerchants.some(b => b.id === m.id)), [merchants, levelAMerchants, levelBMerchants]);
  const promotionalMerchants = useMemo(() => levelBMerchants.length > 0 ? levelBMerchants.slice(0, 4) : merchants.filter(m => m.promotion.isActive).slice(0, 4), [levelBMerchants, merchants]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans selection:bg-violet-100 max-w-[1440px] mx-auto">
      <TopBar />
      
      {/* Portal Hero & Highlights */}
      <section className="bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row min-h-[400px] lg:min-h-[500px]">
            <div className="flex-[2] border-r border-slate-50 p-6 md:p-10 flex flex-col justify-center relative">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-50/40 via-transparent to-transparent opacity-70 pointer-events-none" />
               <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-100">
                    <Flame className="h-3 w-3 animate-pulse" /> Bairro Vivo Araruama
                  </div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 mb-4 leading-[0.9]">
                    O Portal da Sua <br /><span className="text-orange-600">Comunidade.</span>
                  </h1>
                  
                  <div className="flex flex-col gap-4">
                    <form onSubmit={handleSearch} className="relative max-w-xl group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      <input type="text" placeholder="O que você precisa hoje?" className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-32 text-sm md:text-base font-medium outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 transition-all shadow-lg shadow-slate-200/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                      <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">Buscar</Button>
                    </form>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest w-full mb-1">Mais procurados:</span>
                       {['Padarias', 'Farmácias', 'Pet Shops', 'Promoções'].map(term => (
                         <button 
                           key={term}
                           onClick={() => {setSearchTerm(term); handleSearch();}}
                           className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all"
                         >
                           {term}
                         </button>
                       ))}
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex-1 bg-slate-50/30 p-6 md:p-8 flex flex-col gap-4 border-t lg:border-t-0">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Acontecendo Agora</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                 <div className="bg-slate-900 rounded-3xl p-5 text-white cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => navigate({ to: '/negocios', search: { hasPromotion: true } })}>
                    <Badge className="bg-orange-600 text-white mb-2 text-[8px] uppercase font-black tracking-widest border-none">Super Oferta</Badge>
                    <h4 className="text-lg font-black leading-tight mb-1">Cantina da Nonna</h4>
                    <p className="text-slate-400 text-[10px] font-medium">50% Off em Vinhos selecionados hoje!</p>
                 </div>
                 <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => navigate({ to: '/noticias' })}>
                    <div className="flex gap-3">
                       <div className="bg-orange-50 text-orange-600 w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 border border-orange-100">
                          <span className="text-base font-black leading-none">15</span>
                          <span className="text-[7px] font-black uppercase">JUN</span>
                       </div>
                       <div>
                          <Badge variant="outline" className="text-[7px] uppercase font-black mb-1 border-slate-200">Evento</Badge>
                          <h4 className="font-black text-slate-900 text-xs leading-tight">Festival do Pescado 2026</h4>
                       </div>
                    </div>
                 </div>
               </div>
               
               {/* Discrete Desktop Commercial Banner */}
               <div className="hidden lg:block mt-auto pt-4 border-t border-slate-100">
                 <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-white hover:border-orange-200 transition-all">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                       <PlusCircle className="w-4 h-4" />
                     </div>
                     <div>
                       <p className="text-[9px] font-black uppercase text-slate-400 group-hover:text-orange-600 transition-colors">Seja um Parceiro</p>
                       <p className="text-[10px] font-bold text-slate-600">Sua marca aqui.</p>
                     </div>
                   </div>
                   <ArrowUpRight className="w-3 h-3 text-slate-300 group-hover:text-orange-500 transition-colors" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ofertas Locais - High Priority */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mt-8 mb-8">
        <div className="bg-orange-600 rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Tag className="w-32 h-32 rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <Badge className="bg-white/20 text-white border-none mb-2 text-[9px] uppercase font-black tracking-[0.2em]">Oportunidades</Badge>
                <h2 className="text-2xl md:text-4xl font-black tracking-tighter">Ofertas do Bairro</h2>
              </div>
              <Button onClick={() => navigate({ to: '/negocios' })} className="bg-white text-orange-600 hover:bg-orange-50 font-black text-[10px] uppercase h-10 px-6 rounded-xl hidden sm:flex">
                Ver tudo
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading ? [...Array(4)].map((_, i) => <MerchantSkeleton key={i} />) : promotionalMerchants.slice(0, 4).map(m => <MerchantCard key={m.id} merchant={m} />)}
            </div>
            <Button onClick={() => navigate({ to: '/negocios' })} className="w-full mt-6 bg-white text-orange-600 hover:bg-orange-50 font-black text-[10px] uppercase h-12 rounded-xl sm:hidden">
              Ver todas as ofertas
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Notícias & Acesso Rápido - High Density */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-orange-600" /> Notícias & Utilidade
                </h2>
                <Link to="/noticias" className="text-[10px] font-black uppercase text-orange-600 hover:underline flex items-center gap-1">
                  Ver todas <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {newsRepository.getAll().slice(0, 4).map(item => (
                   <div key={item.id} className="bg-white p-3 rounded-2xl border border-slate-100 flex gap-3 hover:shadow-md transition-all cursor-pointer group" onClick={() => navigate({ to: '/noticias' })}>
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0"><img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" /></div>
                      <div className="min-w-0 flex flex-col justify-center">
                        <span className="text-[8px] font-black uppercase text-orange-600 mb-1">{item.category}</span>
                        <h3 className="font-black text-slate-900 text-xs line-clamp-2 leading-snug">{item.title}</h3>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="lg:col-span-4">
              <h2 className="text-lg font-black text-slate-900 mb-4">Acesso Rápido</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                 {[
                   { label: 'Padarias', icon: Croissant, path: '/negocios' },
                   { label: 'Ofertas', icon: Tag, path: '/negocios' },
                   { label: 'Transporte', icon: Car, path: '/transporte' },
                   { label: 'Serviços', icon: Wrench, path: '/servicos' },
                   { label: 'Eventos', icon: Calendar, path: '/noticias' },
                   { label: 'Pets', icon: PawPrint, path: '/negocios' }
                 ].map(item => (
                   <div 
                     key={item.label} 
                     onClick={() => navigate({ to: item.path as any })}
                     className="bg-white border border-slate-100 p-3 rounded-xl flex items-center gap-3 hover:bg-orange-600 group cursor-pointer shadow-sm transition-all"
                   >
                      <item.icon className="w-4 h-4 text-orange-600 group-hover:text-white transition-colors" />
                      <span className="text-[9px] font-black uppercase text-slate-600 group-hover:text-white transition-colors">{item.label}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      <div className="hidden lg:block">
        <ValueProposition />
        <SponsorSection />
      </div>

      <Footer />
      <FloatingNav />
    </div>
  );
}