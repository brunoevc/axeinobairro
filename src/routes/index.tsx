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
  RefreshCw
} from "lucide-react";

import { categories } from "@/data/merchants";
import { merchantsRepository } from "@/repositories/merchantsRepository";

import { MerchantCard } from "@/components/MerchantCard";
import { MerchantSkeleton } from "@/components/MerchantSkeleton";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { useLocation } from "@/hooks/useLocation";

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
  const merchants = useMemo(() => merchantsRepository.getAll(), []);
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      navigate({ to: '/negocios', search: { q: searchTerm.trim() } });
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
    <div className="min-h-screen bg-slate-50 pb-24 font-sans selection:bg-violet-100">
      <TopBar />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-violet-50/50 via-transparent to-transparent opacity-70" />
        
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-100 shadow-sm">
              <TrendingUp className="h-3 w-3" />
              +10 negócios em Araruama
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-[0.9]">
              Encontre comércios, <br className="hidden md:block" />
              <span className="text-orange-600">serviços e promoções</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-xl mx-auto md:mx-0">
              O Axêi no Bairro conecta você aos negócios locais mais próximos, com ofertas, rotas e contato direto pelo WhatsApp.
            </p>
            
            <div className="flex flex-col gap-6">
              <form onSubmit={handleSearch} className="relative max-w-xl group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Busque por restaurante, padaria, serviço..."
                  className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-12 pr-32 text-sm md:text-base font-medium outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-600 transition-all shadow-xl shadow-slate-200/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                >
                  Pesquisar
                </Button>
              </form>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate({ to: '/negocios' })}
                  className="h-16 px-10 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black shadow-xl shadow-orange-200 transition-all active:scale-95 text-lg group"
                >
                  Ver negócios
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate({ to: '/cadastro' })}
                  className="h-16 px-10 bg-white border-slate-200 text-slate-700 rounded-2xl font-black hover:bg-slate-50 transition-all active:scale-95 text-lg"
                >
                  Cadastrar minha loja
                </Button>
                <Button 
                  variant="link"
                  onClick={() => navigate({ to: '/negocios', search: { bairro: 'Centro' } })}
                  className="h-16 px-4 text-orange-600 font-black hover:no-underline hover:text-orange-700 transition-all active:scale-95 text-base"
                >
                  Ver negócios no Centro de Araruama
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>


              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md hidden md:block">
            <div className="relative">
               <div className="absolute -inset-4 bg-orange-100 rounded-[3rem] blur-3xl opacity-30 animate-pulse" />
               <div className="relative bg-white border border-slate-100 p-8 rounded-[3rem] shadow-2xl space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                     <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white">
                        <Star className="w-6 h-6 fill-white" />
                     </div>
                     <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Destaque de hoje</div>
                        <div className="text-sm font-bold text-slate-900">Cantina da Nonna</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                     <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                        <Tag className="w-6 h-6" />
                     </div>
                     <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Oferta ativa</div>
                        <div className="text-sm font-bold text-slate-900">50% Off em Vinhos</div>
                     </div>
                  </div>
                  <div className="pt-2">
                     <div className="flex items-center justify-between mb-4">
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Atividade Recente</div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     </div>
                     <div className="space-y-3">
                        <div className="h-2 bg-slate-100 rounded-full w-full" />
                        <div className="h-2 bg-slate-100 rounded-full w-3/4" />
                        <div className="h-2 bg-slate-100 rounded-full w-1/2" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acontecendo Agora */}
      <section className="max-w-7xl mx-auto px-6 mt-12 mb-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Acontecendo Agora</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Croissant className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 leading-none mb-1">Padaria aberta agora</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Pão quentinho em Rio do Limão</div>
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 leading-none mb-1">Promoção ativa perto de você</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">50% OFF em Cantina da Nonna</div>
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 leading-none mb-1">Entrega disponível</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">PetShop Amigo Fiel com delivery</div>
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 leading-none mb-1">Pet shop em destaque</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Banho & Tosa hoje no Centro</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500 fill-orange-500" />
              Acesso Rápido
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.slug}
                  onClick={() => navigate({ to: '/negocios', search: { categoria: cat.slug } })}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-orange-200">
                    <Icon className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-black text-center uppercase tracking-wider text-slate-500 group-hover:text-orange-600 transition-colors">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mais procurados do bairro */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-violet-100">
              Popular hoje
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
              {levelAMerchants.length > 0 ? "Destaques Principais" : "Mais procurados do bairro"}
            </h2>
            <p className="text-slate-500 font-medium text-lg mt-2">
              {levelAMerchants.length > 0 ? "As melhores oportunidades selecionadas para você" : "Destaques que a vizinhança está amando em Araruama"}
            </p>
          </div>
          <Button 
            variant="ghost"
            onClick={() => navigate({ to: '/negocios' })}
            className="text-orange-600 font-black hover:bg-orange-50 self-start md:self-auto"
          >
            Ver todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading 
            ? [...Array(3)].map((_, i) => <MerchantSkeleton key={i} />)
            : featuredMerchants.length > 0 ? (
                featuredMerchants.map((merchant) => (
                  <MerchantCard key={merchant.id} merchant={merchant} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-100">
                  <p className="text-slate-400 font-bold">Nenhum destaque disponível no momento.</p>
                </div>
              )
          }
        </div>

      </section>

      {/* Nearby Businesses */}
      {nearbyMerchants.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                <Navigation className="w-8 h-8 text-orange-600" />
                Mais próximos de você
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-slate-500 font-medium text-lg">Negócios que estão a poucos passos de distância</p>
                {locationLoading && (
                  <div className="flex items-center gap-2 px-2 py-1 bg-orange-50 rounded-lg animate-pulse">
                    <RefreshCw className="w-3 h-3 text-orange-500 animate-spin" />
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Atualizando GPS...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nearbyMerchants.map((merchant) => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        </section>
      )}

      {/* Local Widgets / Info */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Compre Local</h3>
               <p className="text-slate-500 font-medium">Fortaleça a economia do seu bairro e receba atendimento personalizado de quem você conhece.</p>
            </div>
            <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
               <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                  <Clock className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Rápido e Direto</h3>
               <p className="text-slate-500 font-medium">Nada de intermediários. Fale diretamente com o lojista via WhatsApp e resolva tudo em minutos.</p>
            </div>
            <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
               <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                  <MapPin className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Hiperlocal</h3>
               <p className="text-slate-500 font-medium">Filtre por bairro e encontre exatamente o que você precisa a poucos metros de distância.</p>
            </div>
         </div>
      </section>

      {/* Promotions Section */}
      <section className="max-w-7xl mx-auto px-6 mt-24 pb-20">
        <div className="bg-orange-600 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl -ml-48 -mb-48" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-white/20">
                <Tag className="h-3 w-3" />
                Economia Real no Bairro
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                {levelBMerchants.length > 0 ? "Impulsos Comerciais" : "Ofertas perto de você"}
              </h2>
              <p className="text-orange-100 font-medium text-xl mt-4">
                {levelBMerchants.length > 0 ? "Novidades e impulsos dos lojistas locais" : "Economize comprando no comércio local de Araruama"}
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate({ to: '/negocios', search: { hasPromotion: true } })}
              className="bg-white text-orange-600 hover:bg-orange-50 font-black rounded-xl border-none h-12 px-8 shadow-xl shadow-orange-900/20 transition-all active:scale-95 self-start md:self-auto"
            >
              Ver todas as ofertas
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {isLoading 
              ? [...Array(4)].map((_, i) => <MerchantSkeleton key={i} />)
              : promotionalMerchants.map((merchant) => (
                <MerchantCard key={merchant.id} merchant={merchant} />
              ))
            }
          </div>
        </div>
      </section>

      {/* Promoções Comuns (Level C) */}
      {levelCMerchants.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-24 pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-100">
                Promoção Comum
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Mais Promoções</h2>
              <p className="text-slate-500 font-medium text-lg mt-2">Confira outras ofertas imperdíveis no bairro</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {levelCMerchants.map((merchant) => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        </section>
      )}

      <footer className="bg-slate-900 text-white py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <Logo dark />
            <p className="text-slate-400 font-medium max-w-xs">
              Encontre. Conecte. Fortaleça o comércio local.
            </p>
            <div className="mt-4 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Uma solução Hubia Connect</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">CNPJ 27.807.284/0001-89</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
             <div className="flex flex-col gap-4 text-center md:text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Plataforma</span>
                <Link to="/negocios" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Ver Negócios</Link>
                <Link to="/cadastro" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Cadastrar Loja</Link>
             </div>
             <div className="flex flex-col gap-4 text-center md:text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Suporte</span>
                <a href="#" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Central de Ajuda</a>
                <a href="#" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors">Termos de Uso</a>
             </div>
             <div className="hidden sm:flex flex-col gap-4 text-center md:text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cidade Sede</span>
                <span className="text-sm font-bold text-slate-300">Araruama / RJ</span>
             </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
           <span>© 2026 Axêi no Bairro. Todos os direitos reservados.</span>
           <div className="flex items-center gap-6">
              <a href="https://www.instagram.com/axeinobairro" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a href="https://www.facebook.com/axeinobairro/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
              <a href="https://wa.me/5521999869070" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
           </div>
        </div>
      </footer>

      <FloatingNav />
    </div>
  );
}