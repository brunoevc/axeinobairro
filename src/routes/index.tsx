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
    Store
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
    // Sincronizar com o repositório
    const unsubscribe = merchantsRepository.subscribe(() => {
      setMerchants(merchantsRepository.getAll());
    });

    const timer = setTimeout(() => setIsLoading(false), 800);
    
    const unsubscribeRecs = recommendationsRepository.subscribe(() => {
      setRecommendations(recommendationsRepository.getActive().slice(0, 3));
    });

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
      intentTracker.track({
        type: 'search',
        source: 'home',
        category: 'alimentacao' as EconomicCategory,
        territory: 'Araruama' as Territory,
      });
    } else {
      navigate({ to: '/negocios' });
    }

  };
  
  // Prioritized governance logic: A > B > C
  const levelAMerchants = useMemo(() => merchants.filter(m => m.exposureLevel === 'A'), []);
  const levelBMerchants = useMemo(() => 
    merchants.filter(m => m.exposureLevel === 'B' && !levelAMerchants.some(a => a.id === m.id)), 
    [levelAMerchants]
  );
  const levelCMerchants = useMemo(() => 
    merchants.filter(m => m.exposureLevel === 'C' && !levelAMerchants.some(a => a.id === m.id) && !levelBMerchants.some(b => b.id === m.id)), 
    [levelAMerchants, levelBMerchants]
  );

  const featuredMerchants = useMemo(() => {
    // If we have level A, use them, otherwise fallback to legacy featured
    if (levelAMerchants.length > 0) return levelAMerchants.slice(0, 3);
    return merchants.filter(m => m.featured).slice(0, 3);
  }, [levelAMerchants]);

  const promotionalMerchants = useMemo(() => {
    // Priority B merchants for this section
    if (levelBMerchants.length > 0) return levelBMerchants.slice(0, 4);
    return merchants.filter(m => m.promotion.isActive).slice(0, 4);
  }, [levelBMerchants]);

  const nearbyMerchants = useMemo(() => {
    // We want the listing to update reactively, but we also want a smooth transition
    // If location is loading and we don't have coords yet, return empty
    if (!coords && locationLoading) return [];
    
    // Even if no coords (GPS denied), we don't show "nearby" 
    if (!coords) return [];

    return [...merchants]
      .map(m => ({
        ...m,
        distance: getDistance(coords.latitude, coords.longitude, m.latitude, m.longitude)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [coords, getDistance, locationLoading]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans selection:bg-violet-100 max-w-[1440px] mx-auto">
      <TopBar />
      
      {/* 1. Portal Hero & Highlights (Multi-Content Dobra) */}
      <section className="bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row min-h-[500px]">
            {/* Main Content Area (Portal Hero) */}
            <div className="flex-[1.8] border-r border-slate-50 p-6 md:p-10 flex flex-col justify-center relative">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-50/40 via-transparent to-transparent opacity-70 pointer-events-none" />
               
               <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-100">
                    <Flame className="h-3 w-3 animate-pulse" />
                    Bairro Vivo Araruama
                  </div>
                  
                  <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 mb-6 leading-[0.85]">
                    O Portal da Sua <br />
                    <span className="text-orange-600">Comunidade.</span>
                  </h1>
                  
                  <p className="text-slate-500 text-base md:text-xl font-medium mb-10 leading-relaxed max-w-xl">
                    Tudo o que acontece agora no bairro: ofertas, serviços, notícias e oportunidades reais.
                  </p>

                  <div className="flex flex-col gap-4">
                    <form onSubmit={handleSearch} className="relative max-w-xl group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="O que você precisa hoje?"
                        className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-12 pr-32 text-sm md:text-base font-medium outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 transition-all shadow-xl shadow-slate-200/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button 
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                      >
                        Buscar
                      </Button>
                    </form>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
                      <Button onClick={() => navigate({ to: '/negocios' })} className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-xs uppercase px-6 h-11 shadow-lg shadow-orange-200">
                        <Store className="w-4 h-4 mr-2" /> Ver lojas
                      </Button>
                      <Button onClick={() => navigate({ to: '/painel' })} variant="outline" className="border-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase px-6 h-11">
                        <User className="w-4 h-4 mr-2" /> Meu Axêi
                      </Button>
                      <Button onClick={() => navigate({ to: '/cadastro' })} variant="ghost" className="text-slate-500 hover:text-orange-600 font-black text-xs uppercase h-11">
                        Anunciar
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] md:text-xs font-bold text-slate-400 mt-6 px-1 overflow-x-auto no-scrollbar whitespace-nowrap">
                       <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Ofertas Reais</span>
                       <span className="flex items-center gap-1.5 ml-4"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Profissionais Verificados</span>
                       <span className="flex items-center gap-1.5 ml-4"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Notícias Locais</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* 2. Side Highlights Column (Acontecendo Agora - Desktop Only) */}
            <div className="hidden lg:flex flex-1 bg-slate-50/50 p-8 flex-col gap-6">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Acontecendo Agora</h3>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
               </div>

               {/* Rotating Mini Banner (Oferta Ativa) */}
               <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden group cursor-pointer" onClick={() => navigate({ to: '/negocios', search: { hasPromotion: true } })}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                     <Tag className="w-20 h-20 rotate-12" />
                  </div>
                  <Badge className="bg-orange-600 text-white mb-3 text-[9px] uppercase font-black tracking-widest border-none">Super Oferta</Badge>
                  <h4 className="text-xl font-black leading-tight mb-2">Cantina da Nonna</h4>
                  <p className="text-slate-400 text-xs font-medium mb-4">50% Off em Vinhos selecionados somente hoje!</p>
                  <div className="flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-widest">
                     Ver Oferta <ArrowRight className="w-3 h-3" />
                  </div>
               </div>

               {/* Upcoming Event Snippet (Evento/Comunicado) */}
               <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate({ to: '/admin/agenda' })}>
                  <div className="flex gap-4">
                     <div className="bg-orange-50 text-orange-600 w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border border-orange-100">
                        <span className="text-lg font-black leading-none">15</span>
                        <span className="text-[8px] font-black uppercase">JUN</span>
                     </div>
                     <div>
                        <h4 className="font-black text-slate-900 text-sm leading-tight mb-1">Festival do Pescado 2026</h4>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                           <MapPin className="w-2.5 h-2.5" /> Praça do Centro
                        </p>
                     </div>
                  </div>
               </div>

               {/* Quick Info (Apoiador/Patrocinador) */}
               <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                     </div>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Apoiadores Locais</span>
                  </div>
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white text-[8px] font-black flex items-center justify-center border-2 border-white">+12</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Conteúdo de Resumo e Acesso Rápido */}
      <section className="max-w-[1440px] mx-auto px-6 mt-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
           {/* Notícias Quick Feed (8 columns) */}
           <div className="md:col-span-8">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                   <Newspaper className="w-5 h-5 text-orange-600" />
                   Notícias do Bairro
                 </h2>
                 <Link to="/noticias" className="text-orange-600 font-bold text-xs flex items-center hover:underline uppercase tracking-widest">
                   Ver todas <ArrowRightCircle className="w-3.5 h-3.5 ml-1.5" />
                 </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {newsRepository.getAll().slice(0, 2).map(item => (
                   <div key={item.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 flex gap-4 hover:shadow-lg transition-all group cursor-pointer" onClick={() => navigate({ to: '/noticias' })}>
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                         <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      </div>
                      <div className="min-w-0">
                         <span className="text-[9px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md mb-2 inline-block">{item.category}</span>
                         <h3 className="font-black text-slate-900 leading-tight text-sm line-clamp-2 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Categorias / Busca Rápida (4 columns) */}
           <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                 <h2 className="text-xl font-black text-slate-900">Navegar por</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-orange-600 hover:border-orange-600 group transition-all cursor-pointer shadow-sm hover:shadow-orange-200" onClick={() => navigate({ to: '/negocios', search: { categoria: 'alimentacao' } })}>
                    <Croissant className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white transition-colors">Padarias</span>
                 </div>
                 <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-orange-600 hover:border-orange-600 group transition-all cursor-pointer shadow-sm hover:shadow-orange-200" onClick={() => navigate({ to: '/negocios', search: { hasPromotion: true } })}>
                    <Tag className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white transition-colors">Ofertas</span>
                 </div>
                 <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-orange-600 hover:border-orange-600 group transition-all cursor-pointer shadow-sm hover:shadow-orange-200" onClick={() => navigate({ to: '/transporte' })}>
                    <Bike className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white transition-colors">Transporte</span>
                 </div>
                 <div className="bg-white border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-orange-600 hover:border-orange-600 group transition-all cursor-pointer shadow-sm hover:shadow-orange-200" onClick={() => navigate({ to: '/servicos' })}>
                    <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-white transition-colors">Serviços</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Mais Procurados (Discovery) */}
      <section className="max-w-[1440px] mx-auto px-6 mt-12 md:mt-24 mb-24">
        <div className="text-center md:text-left mb-8">
           <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 justify-center md:justify-start">
             <SearchCheck className="w-6 h-6 text-orange-600" />
             Mais procurados no bairro
           </h2>
           <p className="text-sm font-medium text-slate-500">Encontre o que você precisa rapidamente</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.slug}
                onClick={() => navigate({ to: '/negocios', search: { categoria: cat.slug } })}
                className="flex flex-col items-center gap-4 group"
              >
                <div className="w-20 h-20 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-orange-200">
                  <Icon className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-[11px] font-black text-center uppercase tracking-widest text-slate-500 group-hover:text-orange-600 transition-colors">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Institutional (Demoted on Mobile) */}
      <div className="hidden lg:block max-w-[1440px] mx-auto">
        <ValueProposition />
      </div>

      <div className="lg:hidden px-6 mt-12 mb-12">
        <div className="bg-violet-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2 italic">A Sua Voz Importa</h3>
            <p className="text-violet-100 text-xs font-medium mb-6">Estamos construindo o futuro do bairro com você. Deixe seu feedback!</p>
            <Button 
              variant="secondary" 
              className="w-full rounded-xl font-black h-11 bg-white text-violet-600 hover:bg-violet-50"
              onClick={() => navigate({ to: '/feedback' })}
            >
              Dar Feedback
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Ofertas do Bairro - High Visibility */}
      <section className="max-w-[1440px] mx-auto px-6 mt-24 pb-20">
        <div className="bg-orange-600 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl shadow-orange-200">
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter">
                Ofertas do Bairro
              </h2>
              <p className="text-orange-100 font-medium text-lg md:text-xl mt-2 md:mt-4">
                Economize no comércio local
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate({ to: '/negocios', search: { hasPromotion: true } })}
              className="bg-white text-orange-600 hover:bg-orange-50 font-black rounded-xl border-none h-11 md:h-12 px-6 md:px-8 shadow-xl shadow-orange-900/20 transition-all active:scale-95"
            >
              Ver todas
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
            {isLoading 
              ? [...Array(4)].map((_, i) => <MerchantSkeleton key={i} />)
              : promotionalMerchants.slice(0, 4).map((merchant) => (
                <MerchantCard key={merchant.id} merchant={merchant} />
              ))
            }
          </div>
        </div>
      </section>

      {/* 5. Destaques do Bairro (Phase 8.3) */}
      <section className="max-w-[1440px] mx-auto px-6 mt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-100 shadow-sm">
              <Zap className="h-3 w-3 fill-orange-600" />
              Patrocinado
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
              Destaques em Evidência
            </h2>
            <p className="text-slate-500 font-medium text-base mt-1 md:mt-2">
              Lojas e profissionais em destaque na sua região.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading 
            ? [...Array(3)].map((_, i) => <MerchantSkeleton key={i} />)
            : activeBoosts.filter(b => b.level === 'A').slice(0, 6).map((boost) => {
                if (boost.targetType === 'loja') {
                  const item = merchants.find(m => m.id === boost.targetId);
                  if (!item) return null;
                  return (
                    <div key={boost.id} className="relative group">
                      <div className="absolute -top-3 -right-3 z-10 bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border-2 border-white uppercase tracking-wider">
                        <Star className="w-3 h-3 fill-white" />
                        Destaque
                      </div>
                      <MerchantCard merchant={item} />
                    </div>
                  );
                }
                if (boost.targetType === 'servico') {
                  const item = services.find(s => s.id === boost.targetId);
                  if (!item) return null;
                  return (
                    <Card key={boost.id} className="rounded-3xl border-2 border-orange-100 hover:shadow-xl transition-all duration-300 group overflow-hidden relative flex flex-col h-full">
                      <div className="absolute -top-3 -right-3 z-10 bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border-2 border-white uppercase tracking-wider">
                        <Star className="w-3 h-3 fill-white" />
                        Destaque
                      </div>
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="outline" className="text-[10px] font-bold uppercase py-1 border-slate-200 capitalize">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-colors shrink-0">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-lg text-slate-900 truncate">{item.name}</h3>
                            <div className="flex items-center gap-1 text-orange-500">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs font-bold">{item.rating || 'Novo'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <Button 
                            onClick={() => window.open(servicesRepository.formatWhatsAppLink(item.phone, "Olá, vi seu destaque no Axêi no Bairro."), "_blank")}
                            className="w-full bg-slate-900 hover:bg-orange-600 text-white rounded-xl h-12 font-black text-xs uppercase transition-all"
                          >
                            Ver Serviço
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
                return null;
              })
          }
        </div>
      </section>

      {/* 5.1 Transporte Alternativo Section */}
      <section className="max-w-[1440px] mx-auto px-6 mt-24">
        <div className="bg-slate-900 rounded-[3rem] p-12 overflow-hidden relative border-8 border-slate-100 shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
             <Car className="w-full h-full text-white -rotate-12 translate-x-12 translate-y-12" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <Badge className="bg-orange-600 text-white mb-6 font-black uppercase tracking-widest px-4 py-2 rounded-xl text-xs">Comunidade Viva</Badge>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-none italic">
                Transporte <br /> <span className="text-orange-600">Alternativo Local</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-xl">
                Encontre carros e motos disponíveis no bairro e combine sua viagem pelo WhatsApp. Direto e rápido.
              </p>
              <Button 
                onClick={() => navigate({ to: '/transporte' })}
                className="h-16 px-12 bg-white hover:bg-orange-50 text-slate-900 rounded-2xl font-black text-lg transition-all active:scale-95 group shadow-xl"
              >
                Ver motoristas
                <ArrowRight className="ml-3 h-6 w-6 text-orange-600 transition-transform group-hover:translate-x-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* 6. Serviços da Comunidade */}
      <section className="max-w-[1440px] mx-auto px-6 mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-orange-600" />
              Serviços da Comunidade
            </h2>
          </div>
          <Button 
            variant="ghost"
            onClick={() => navigate({ to: '/servicos' })}
            className="text-orange-600 font-black hover:bg-orange-50 self-start md:self-auto"
          >
            Ver todos profissionais
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 4).map((service) => (
            <Card key={service.id} className="rounded-3xl border border-slate-100 hover:shadow-xl transition-all group flex flex-col h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-colors shrink-0">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 truncate">{service.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{service.category}</p>
                  </div>
                </div>
                <div className="mt-auto">
                  <Button 
                    variant="outline"
                    onClick={() => navigate({ to: '/servicos' })}
                    className="w-full border-slate-200 rounded-xl font-black text-xs uppercase h-11"
                  >
                    Solicitar Orçamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. Notícias e Agenda Section */}
      <section className="max-w-[1440px] mx-auto px-6 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Notícias */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Newspaper className="w-6 h-6 text-orange-600" />
                Notícias Locais
              </h2>
              <Link to="/noticias" className="text-orange-600 font-bold text-sm flex items-center hover:underline">
                Ver todas <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {newsRepository.getAll().slice(0, 3).map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 hover:shadow-md transition-shadow">
                  <img src={item.imageUrl} className="w-20 h-20 rounded-xl object-cover" alt="" />
                  <div>
                    <span className="text-[10px] font-black uppercase text-orange-600">{item.category}</span>
                    <h3 className="font-bold text-slate-900 leading-tight">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-orange-600" />
                Agenda do Bairro
              </h2>
              <Link to="/admin/agenda" className="text-orange-600 font-bold text-sm flex items-center hover:underline">
                Ver agenda <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-black">15</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">JUN</div>
                </div>
                <div>
                  <h3 className="font-bold">Festival do Pescado</h3>
                  <p className="text-sm text-slate-400">Praça do Centro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Representantes */}
      <section className="max-w-[1440px] mx-auto px-6 mt-24 bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-3xl font-black mb-4">Representantes Locais</h2>
            <p className="text-slate-400 mb-8 font-medium">Conheça quem ajuda a conectar moradores, comerciantes e oportunidades na sua região.</p>
            <Button asChild className="bg-orange-600 hover:bg-orange-700 rounded-xl px-8 w-full sm:w-auto h-12 font-black">
              <Link to="/representantes">Ver representantes</Link>
            </Button>
          </div>
          <div className="flex -space-x-4">
            {representativesRepository.getAll().slice(0, 3).map(rep => (
              <div 
                key={rep.id} 
                className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center font-black border-4 border-slate-900 shadow-xl"
                title={rep.name}
              >
                {rep.name.charAt(0)}
              </div>
            ))}
            <div className="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center font-black border-4 border-slate-900 shadow-xl text-xs">
              +{representativesRepository.getAll().length}
            </div>
          </div>
        </div>
      </section>

      {/* Promotions Section - Removed duplicate since it's above */}
      
      {/* Promoções Comuns (Level C) */}
      {levelCMerchants.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 mt-12 pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-100">
                Mais Ofertas
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Economia Local</h2>
              <p className="text-slate-500 font-medium text-lg mt-2">Confira outras oportunidades imperdíveis no bairro</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {levelCMerchants.map((merchant) => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        </section>
      )}

      {/* 9. Dicas úteis para o bairro */}
      <section className="max-w-[1440px] mx-auto px-6 mt-24 mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-100">
              <Sparkles className="w-3 h-3" />
              Seleção do Axêi
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
              Dicas úteis para o bairro
            </h2>
            <p className="text-slate-500 font-medium text-lg mt-2">
              Produtos e serviços recomendados para o seu dia a dia.
            </p>
          </div>
          <Button 
            variant="ghost"
            onClick={() => navigate({ to: '/recomendacoes' })}
            className="text-orange-600 font-black hover:bg-orange-50 self-start md:self-auto"
          >
            Ver todas as dicas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="group overflow-hidden rounded-[2.5rem] border-slate-100 hover:border-orange-200 hover:shadow-2xl transition-all h-full flex flex-col">
              <div className="aspect-[16/10] relative overflow-hidden bg-slate-50">
                {rec.imageUrl ? (
                  <img src={rec.imageUrl} alt={rec.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-slate-900 border-none font-black text-[10px] uppercase px-2 py-0.5 rounded-lg">
                    {rec.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {rec.title}
                </h3>
                <p className="text-sm text-slate-500 mb-6 line-clamp-3 font-medium min-h-[4.5rem]">
                  {rec.description}
                </p>
                <div className="mt-auto">
                  <Button 
                    asChild
                    variant="outline"
                    className="w-full border-slate-200 rounded-xl font-black text-xs uppercase hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all"
                  >
                    <Link to="/recomendacoes">Ver Detalhes</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 10. Classificados Final */}
      <section className="max-w-[1440px] mx-auto px-6 mb-24">
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-2 italic">Classificados do Bairro</h3>
            <p className="text-slate-400 font-medium">Venda, trocas e oportunidades locais perto de você.</p>
          </div>
          <Button 
            variant="secondary" 
            className="rounded-2xl font-black h-14 px-10 bg-white text-slate-900 hover:bg-slate-100 relative z-10 shadow-xl"
            onClick={() => navigate({ to: '/classificados' })}
          >
            Ver Classificados
          </Button>
        </div>
      </section>

      <SponsorSection />
      <Footer />

      <FloatingNav />
    </div>
  );
}