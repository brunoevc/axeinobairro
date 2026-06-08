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
  MapPin,
  ArrowUpRight,
  Users,
  Heart,
  History,
  Info,
  ExternalLink,
  Store,
  Clock
} from "lucide-react";

import { merchantsRepository } from "@/repositories/merchantsRepository";
import { servicesRepository } from "@/repositories/servicesRepository";
import { newsRepository } from "@/repositories/newsRepository";
import { communitiesRepository } from "@/repositories/communitiesRepository";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "@/hooks/useLocation";
import { useFavorites } from "@/hooks/useFavorites";
import { useFollowCommunities } from "@/hooks/useFollowCommunities";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Footer } from "@/components/Footer";
import { SponsorSection } from "@/components/SponsorSection";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Axêi - Portal Comunitário e Marketplace Local" },
      { name: "description", content: "Tudo que você precisa, pertinho de você. Comércio, serviços, notícias e eventos da nossa comunidade." },
    ],
  }),
});

function Index() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { locationName } = useLocation();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { followedIds, toggleFollow, isFollowing } = useFollowCommunities();
  const { history: searchHistory } = useSearchHistory();
  
  const [allMerchants, setAllMerchants] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [allNews, setAllNews] = useState<any[]>([]);
  const [allCommunities, setAllCommunities] = useState<any[]>([]);

  useEffect(() => {
    setAllMerchants(merchantsRepository.getAll());
    setAllServices(servicesRepository.getAll());
    newsRepository.getAll().then(setAllNews);
    communitiesRepository.getAll().then(setAllCommunities);
  }, []);

  // Filtered and combined data
  const highlightedItems = useMemo(() => {
    // Cast to any to avoid TS errors with missing properties in mocked data, 
    // or handle properties safely
    const m = allMerchants.filter(item => item.featured).map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      category: item.category,
      rating: item.rating,
      neighborhood: item.neighborhood,
      type: 'merchant' as const
    }));
    
    const s = allServices.slice(0, 3).map(item => ({
      id: item.id,
      name: item.name,
      image: `https://images.unsplash.com/photo-1521791136364-798a7bc0d262?w=400&q=80`, // Placeholder for services
      category: item.category,
      rating: item.rating || 0,
      neighborhood: item.neighborhood,
      type: 'service' as const
    }));

    return [...m, ...s].slice(0, 6);
  }, [allMerchants, allServices]);

  const communityNews = useMemo(() => {
    return allNews.slice(0, 6);
  }, [allNews]);

  const featuredCommunities = useMemo(() => {
    return allCommunities.slice(0, 6);
  }, [allCommunities]);

  const recommendations = useMemo(() => {
    // Basic logic: if user has favorites, show items in same categories
    const favoriteCats = favorites.map(f => {
      const m = allMerchants.find(item => item.id === f.id);
      const s = allServices.find(item => item.id === f.id);
      return m?.category || s?.category;
    }).filter(Boolean);

    let items = [];
    if (favoriteCats.length > 0) {
      items = [...allMerchants, ...allServices]
        .filter(item => favoriteCats.includes(item.category) && !favorites.some(f => f.id === item.id));
    } else {
      items = [...allMerchants, ...allServices]
        .filter(item => (item.rating || 0) >= 4.5);
    }
    
    return items.slice(0, 4).map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      image: 'image' in item ? item.image : `https://images.unsplash.com/photo-1521791136364-798a7bc0d262?w=100&q=80`
    }));
  }, [favorites, allMerchants, allServices]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate({ to: '/busca', search: { q: searchTerm } });
    }
  };

  const handleTagClick = (tag: string) => {
    navigate({ to: '/busca', search: { q: tag } });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100">
      <TopBar />
      
      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: HERO + MAIN FEED (9 columns) */}
          <div className="lg:col-span-9 flex flex-col gap-12 md:gap-16">
            
            {/* NEW HERO */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden shadow-sm">
              <div className="flex-1 relative z-10">
                <Badge className="mb-6 bg-orange-50 text-orange-600 border border-orange-100 px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Portal de Descoberta Local
                </Badge>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-[0.95] tracking-tight">
                  Tudo que você precisa,<br />
                  <span className="text-orange-500">pertinho de você.</span>
                </h1>
                <p className="text-lg text-slate-500 mb-10 font-medium max-w-xl">
                  Comércio, serviços, notícias, eventos e comunidades locais em um só lugar.
                </p>

                <form onSubmit={handleSearch} className="max-w-2xl mb-8">
                  <div className="flex flex-col sm:flex-row gap-3 bg-slate-100 p-2 rounded-2xl sm:rounded-full border border-slate-200 shadow-inner">
                    <div className="flex-1 relative flex items-center">
                      <Search className="absolute left-6 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="O que você procura hoje?" 
                        className="w-full bg-transparent border-none py-4 pl-14 pr-4 text-slate-900 placeholder:text-slate-400 font-bold outline-none focus:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="hidden sm:flex items-center px-6 border-l border-slate-200 gap-2 cursor-pointer">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="text-slate-600 font-bold text-sm whitespace-nowrap">{locationName.split(' - ')[0]}</span>
                    </div>
                    <Button type="submit" className="h-14 px-8 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20">
                      Buscar
                    </Button>
                  </div>
                </form>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Buscas comuns:</span>
                  {["Pizzaria", "Eletricista", "Mercado", "Psicóloga", "Farmácia"].map(tag => (
                    <button 
                      key={tag} 
                      onClick={() => handleTagClick(tag)}
                      className="text-xs font-bold text-slate-600 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full hover:border-orange-500 hover:text-orange-600 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-[320px] lg:w-[400px] shrink-0">
                <div className="relative aspect-square rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl rotate-2">
                  <img 
                    src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80" 
                    alt="Comunidade Local" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-white font-black text-xl leading-tight">Valorize o que é nosso.</p>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-2">Araruama em Foco</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ACONTECENDO AGORA */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <h2 className="text-xl font-black text-slate-900 tracking-tight italic">Acontecendo Agora</h2>
                </div>
                <Link to="/noticias" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-600 transition-colors">
                  Ver Feed Completo
                </Link>
              </div>
              
              <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar">
                {communityNews.map(n => (
                  <div 
                    key={n.id} 
                    className="min-w-[280px] md:min-w-[320px] bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all group cursor-pointer"
                    onClick={() => navigate({ to: '/noticias' })}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-slate-50 text-slate-500 border border-slate-100 text-[8px] font-black uppercase tracking-widest">
                        {n.category}
                      </Badge>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Hoje
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-4 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {n.title}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                          </div>
                        ))}
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-orange-600 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* LOJAS E SERVIÇOS EM DESTAQUE */}
            <section>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Destaques do Bairro</h2>
                  <p className="text-slate-500 text-lg font-medium mt-3">Os negócios e profissionais mais recomendados da região.</p>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" onClick={() => navigate({ to: '/negocios' })} className="rounded-full font-black text-[10px] uppercase tracking-widest h-10 px-6 border-slate-200 text-slate-600 hover:bg-slate-50">Lojas</Button>
                   <Button variant="outline" onClick={() => navigate({ to: '/servicos' })} className="rounded-full font-black text-[10px] uppercase tracking-widest h-10 px-6 border-slate-200 text-slate-600 hover:bg-slate-50">Serviços</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {highlightedItems.map(item => (
                  <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group flex flex-col h-full">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 right-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={`w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white transition-all ${isFavorite(item.id) ? 'text-red-500' : 'text-slate-400'}`}
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id, item.type === 'merchant' ? 'merchant' : 'service', item.name); }}
                        >
                          <Heart className={`w-5 h-5 ${isFavorite(item.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur text-slate-900 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-3.5 h-3.5 text-orange-500 fill-current" />
                        <span className="text-xs font-black text-slate-900">{item.rating}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {item.neighborhood}</span>
                      </div>
                      <h3 className="font-black text-slate-900 text-xl leading-tight mb-4 group-hover:text-orange-600 transition-colors">
                        {item.name}
                      </h3>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                        <Button 
                          variant="ghost" 
                          className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700"
                          onClick={() => navigate({ to: item.type === 'merchant' ? '/negocios' : '/servicos' })}
                        >
                          Ver Detalhes
                        </Button>
                        <div className="flex items-center gap-1.5 text-emerald-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Aberto</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* COMUNIDADES EM DESTAQUE */}
            <section className="bg-white rounded-[3rem] border border-slate-100 p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Voz da Comunidade</h2>
                  <p className="text-slate-500 font-medium mt-2">Grupos e associações que fazem a diferença.</p>
                </div>
                <Button onClick={() => navigate({ to: '/comunidades' })} className="bg-slate-900 hover:bg-slate-800 text-white rounded-full h-12 px-8 font-black text-xs uppercase tracking-widest shadow-xl">
                  Explorar Comunidades
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCommunities.map(comm => (
                  <div key={comm.id} className="p-6 rounded-[2rem] border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-orange-100 hover:shadow-xl transition-all group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shrink-0">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-tight truncate">{comm.name}</h4>
                        <p className="text-[10px] font-black text-orange-600/60 uppercase tracking-widest">{comm.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {comm.neighborhood}
                      </div>
                      <Button 
                        variant={isFollowing(comm.id) ? "outline" : "ghost"}
                        className={`h-9 rounded-full px-5 text-[10px] font-black uppercase tracking-widest transition-all ${isFollowing(comm.id) ? 'border-orange-500 text-orange-600' : 'bg-white text-slate-400 hover:text-orange-600 shadow-sm'}`}
                        onClick={() => toggleFollow(comm.id, comm.name)}
                      >
                        {isFollowing(comm.id) ? "Seguindo" : "Seguir"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT: PERSONALIZATION SIDEBAR (3 columns) - Desktop Only */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 space-y-8">
              
              {/* USER SUMMARY */}
              <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm overflow-hidden relative">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-50 rounded-full blur-2xl opacity-50" />
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-100">
                    {localStorage.getItem("axei_user_name")?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg leading-tight italic">Meu Axêi</h3>
                    <div className="flex items-center gap-1.5 text-orange-600 text-[10px] font-black uppercase tracking-widest">
                      <MapPin className="w-3 h-3" /> {locationName.split(' - ')[0] || "Araruama"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <Link to="/painel" className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all text-center group">
                    <Heart className="w-5 h-5 text-slate-300 group-hover:text-red-500 mx-auto mb-2 transition-colors" />
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900">{favorites.length} Salvos</span>
                  </Link>
                  <Link to="/painel" className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all text-center group">
                    <Users className="w-5 h-5 text-slate-300 group-hover:text-orange-600 mx-auto mb-2 transition-colors" />
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900">{followedIds.length} Seguindo</span>
                  </Link>
                </div>

                {searchHistory.length > 0 && (
                  <div className="pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <History className="w-3.5 h-3.5" /> Buscas Recentes
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map(term => (
                        <button 
                          key={term} 
                          onClick={() => handleTagClick(term)}
                          className="text-[10px] font-bold text-slate-600 hover:text-orange-600 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* PERSONALIZED RECOMMENDATIONS */}
              <section className="bg-orange-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                  <Star className="w-24 h-24 rotate-12 fill-current" />
                </div>
                
                <h3 className="text-xl font-black mb-2 tracking-tight">Para Você</h3>
                <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Baseado no seu perfil</p>

                <div className="space-y-4">
                  {recommendations.map(item => (
                    <div 
                      key={item.id} 
                      className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm transition-all cursor-pointer group/rec"
                      onClick={() => navigate({ to: '/negocios' })}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs leading-tight truncate group-hover/rec:text-white">{item.name}</h4>
                          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">{item.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="w-full mt-8 text-white hover:bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest" asChild>
                  <Link to="/painel">Gerenciar Perfil</Link>
                </Button>
              </section>

              {/* QUICK INFO CARDS */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 hover:border-orange-200 transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">Como Funciona</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guia do Ecossistema</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4 hover:border-orange-200 transition-all cursor-pointer group" onClick={() => navigate({ to: '/planos' })}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">Anuncie Grátis</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Para Lojas e Serviços</p>
                  </div>
                </div>
              </div>

            </div>
          </aside>
        </div>

        {/* SPONSORS SECTION */}
        <div className="mt-20">
          <SponsorSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}