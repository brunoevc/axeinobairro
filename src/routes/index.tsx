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
          <div className="flex flex-col lg:flex-row min-h-[500px]">
            <div className="flex-[1.8] border-r border-slate-50 p-6 md:p-10 flex flex-col justify-center relative">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-50/40 via-transparent to-transparent opacity-70 pointer-events-none" />
               <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-100">
                    <Flame className="h-3 w-3 animate-pulse" /> Bairro Vivo Araruama
                  </div>
                  <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 mb-6 leading-[0.85]">
                    O Portal da Sua <br /><span className="text-orange-600">Comunidade.</span>
                  </h1>
                  <p className="text-slate-500 text-base md:text-xl font-medium mb-10 leading-relaxed max-w-xl">
                    Tudo o que acontece agora no bairro: ofertas, serviços, notícias e oportunidades reais.
                  </p>
                  <div className="flex flex-col gap-4">
                    <form onSubmit={handleSearch} className="relative max-w-xl group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      <input type="text" placeholder="O que você precisa hoje?" className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-12 pr-32 text-sm md:text-base font-medium outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 transition-all shadow-xl shadow-slate-200/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                      <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">Buscar</Button>
                    </form>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
                      <Button onClick={() => navigate({ to: '/negocios' })} className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-xs uppercase px-6 h-11 shadow-lg shadow-orange-200">
                        <Store className="w-4 h-4 mr-2" /> Ver lojas
                      </Button>
                      <Button onClick={() => navigate({ to: '/painel' })} variant="outline" className="border-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase px-6 h-11">
                        <Users className="w-4 h-4 mr-2" /> Meu Axêi
                      </Button>
                      <Button onClick={() => navigate({ to: '/cadastro' })} variant="ghost" className="text-slate-500 hover:text-orange-600 font-black text-xs uppercase h-11">Anunciar</Button>
                    </div>
                  </div>
               </div>
            </div>

            <div className="hidden lg:flex flex-1 bg-slate-50/50 p-8 flex-col gap-6">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Acontecendo Agora</h3>
               <div className="bg-slate-900 rounded-[2rem] p-6 text-white cursor-pointer" onClick={() => navigate({ to: '/negocios', search: { hasPromotion: true } })}>
                  <Badge className="bg-orange-600 text-white mb-3 text-[9px] uppercase font-black tracking-widest border-none">Super Oferta</Badge>
                  <h4 className="text-xl font-black leading-tight mb-2">Cantina da Nonna</h4>
                  <p className="text-slate-400 text-xs font-medium mb-4">50% Off em Vinhos selecionados hoje!</p>
               </div>
               <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm cursor-pointer" onClick={() => navigate({ to: '/admin/agenda' })}>
                  <div className="flex gap-4">
                     <div className="bg-orange-50 text-orange-600 w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border border-orange-100">
                        <span className="text-lg font-black leading-none">15</span>
                        <span className="text-[8px] font-black uppercase">JUN</span>
                     </div>
                     <div>
                        <h4 className="font-black text-slate-900 text-sm leading-tight mb-1">Festival do Pescado 2026</h4>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Conteúdo de Acesso Rápido */}
      <section className="max-w-[1440px] mx-auto px-6 mt-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
           <div className="md:col-span-8">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Newspaper className="w-5 h-5 text-orange-600" /> Notícias do Bairro
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {newsRepository.getAll().slice(0, 2).map(item => (
                   <div key={item.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 flex gap-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate({ to: '/noticias' })}>
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0"><img src={item.imageUrl} className="w-full h-full object-cover" alt="" /></div>
                      <div className="min-w-0"><h3 className="font-black text-slate-900 text-sm line-clamp-2">{item.title}</h3></div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="md:col-span-4">
              <h2 className="text-xl font-black text-slate-900 mb-6">Navegar por</h2>
              <div className="grid grid-cols-2 gap-3">
                 {['Padarias', 'Ofertas', 'Transporte', 'Serviços'].map(label => (
                   <div key={label} className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-orange-600 group cursor-pointer shadow-sm">
                      <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white">{label}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 3. Ofertas Locais */}
      <section className="max-w-[1440px] mx-auto px-6 mt-24 pb-20">
        <div className="bg-orange-600 rounded-[3rem] p-8 md:p-16 text-white">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter mb-12">Ofertas do Bairro</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? [...Array(4)].map((_, i) => <MerchantSkeleton key={i} />) : promotionalMerchants.slice(0, 4).map(m => <MerchantCard key={m.id} merchant={m} />)}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingNav />
    </div>
  );
}