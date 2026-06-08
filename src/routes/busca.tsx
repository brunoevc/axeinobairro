import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  ArrowLeft, 
  Store, 
  Wrench, 
  Newspaper, 
  MapPin, 
  ChevronRight,
  Filter,
  X,
  MessageCircle,
  Clock,
  LayoutGrid,
  History,
  TrendingUp,
  Heart
} from "lucide-react";
import { z } from "zod";
import { merchantsRepository } from "@/repositories/merchantsRepository";
import { servicesRepository } from "@/repositories/servicesRepository";
import { newsRepository } from "@/repositories/newsRepository";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MerchantCard } from "@/components/MerchantCard";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useFavorites } from "@/hooks/useFavorites";


const searchSchema = z.object({
  q: z.string().optional().default(""),
});

export const Route = createFileRoute("/busca")({
  validateSearch: (search) => searchSchema.parse(search),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(q);
  const [activeTab, setActiveTab] = useState<"all" | "merchants" | "services" | "news">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [allMerchants, setAllMerchants] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [allNews, setAllNews] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { history, addSearchTerm, clearHistory } = useSearchHistory();
  const { toggleFavorite, isFavorite } = useFavorites();


  useEffect(() => {
    setSearchTerm(q);
    setIsLoading(true);
    
    // Load data
    const merchants = merchantsRepository.getAll();
    const services = servicesRepository.getAll();
    setAllMerchants(merchants);
    setAllServices(services);
    
    Promise.all([
      newsRepository.getAll()
    ]).then(([news]) => {
      setAllNews(news);
      setIsLoading(false);
    });
  }, [q]);

  const results = useMemo(() => {
    const normalizedQ = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    if (!normalizedQ) return { merchants: [], services: [], news: [] };

    const searchInString = (str: string) => 
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedQ);

    const merchants = allMerchants.filter(m => 
      searchInString(m.name) || searchInString(m.description) || searchInString(m.category) || searchInString(m.neighborhood)
    );

    const services = allServices.filter(s => 
      searchInString(s.name) || searchInString(s.description) || searchInString(s.category) || searchInString(s.neighborhood)
    );

    const news = allNews.filter(n => 
      searchInString(n.title) || searchInString(n.summary) || searchInString(n.category)
    );

    return { merchants, services, news };
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addSearchTerm(searchTerm);
      setShowHistory(false);
      navigate({ to: "/busca", search: { q: searchTerm } });
    }
  };

  const handleHistoryClick = (term: string) => {
    setSearchTerm(term);
    addSearchTerm(term);
    setShowHistory(false);
    navigate({ to: "/busca", search: { q: term } });
  };


  const totalResults = results.merchants.length + results.services.length + results.news.length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <header className="mb-10">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-orange-600 font-bold mb-6 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Início
          </Link>
          
          <div className="relative max-w-3xl z-40">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
              <input 
                type="text" 
                placeholder="O que você procura hoje?" 
                className="w-full bg-white border-2 border-slate-100 rounded-3xl py-6 pl-16 pr-20 text-xl font-black text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/5 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowHistory(true)}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchTerm && (
                  <button 
                    type="button"
                    onClick={() => { setSearchTerm(""); setShowHistory(false); }}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
            </form>

            {showHistory && history.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden py-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="px-6 py-2 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Buscas Recentes</span>
                  <button onClick={clearHistory} className="text-[10px] font-black uppercase text-orange-600 hover:text-orange-700">Limpar</button>
                </div>
                {history.map((term, i) => (
                  <button 
                    key={i}
                    onClick={() => handleHistoryClick(term)}
                    className="w-full px-6 py-4 text-left flex items-center gap-4 hover:bg-slate-50 transition-colors group"
                  >
                    <History className="w-4 h-4 text-slate-300 group-hover:text-orange-600" />
                    <span className="font-bold text-slate-700 group-hover:text-slate-900">{term}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          
          <p className="mt-4 text-slate-500 font-medium">
            {isLoading ? "Buscando..." : `${totalResults} resultados encontrados para "${q || "todos"}"`}
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: "all", label: "Todos", icon: LayoutGrid, count: totalResults },
            { id: "merchants", label: "Lojas", icon: Store, count: results.merchants.length },
            { id: "services", label: "Serviços", icon: Wrench, count: results.services.length },
            { id: "news", label: "Conteúdo", icon: Newspaper, count: results.news.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all shrink-0 ${
                activeTab === tab.id 
                ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`ml-1 opacity-40 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse border border-slate-100" />)}
          </div>
        ) : (
          <div className="space-y-16">
            {/* Merchants Section */}
            {(activeTab === "all" || activeTab === "merchants") && results.merchants.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Store className="w-6 h-6 text-orange-600" /> Lojas e Negócios
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {results.merchants.map(m => <MerchantCard key={m.id} merchant={m} />)}
                </div>
              </section>
            )}

            {/* Services Section */}
            {(activeTab === "all" || activeTab === "services") && results.services.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Wrench className="w-6 h-6 text-orange-600" /> Profissionais e Serviços
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.services.map(s => (
                    <Link 
                      key={s.id} 
                      to="/servicos"
                      className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex items-center gap-4 relative"
                    >
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(s.id, 'service', s.name);
                        }}
                        className={`absolute top-4 right-4 p-2 rounded-full border transition-all ${
                          isFavorite(s.id) ? 'bg-orange-600 border-orange-500 text-white' : 'bg-white border-slate-100 text-slate-300 hover:text-orange-600'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFavorite(s.id) ? 'fill-white' : ''}`} />
                      </button>
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all shrink-0">
                        <Wrench className="w-7 h-7 text-slate-300 group-hover:text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-slate-900 text-base group-hover:text-orange-600 transition-colors truncate">{s.name}</h3>
                        <p className="text-orange-600 text-[9px] font-black uppercase tracking-widest">{s.category}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-slate-300" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.neighborhood}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-orange-600 transition-colors" />
                    </Link>

                  ))}
                </div>
              </section>
            )}

            {/* News/Content Section */}
            {(activeTab === "all" || activeTab === "news") && results.news.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Newspaper className="w-6 h-6 text-orange-600" /> Notícias e Eventos
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.news.map(n => (
                    <Link 
                      key={n.id} 
                      to="/noticias"
                      className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img src={n.imageUrl} alt={n.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <Badge className="absolute top-4 left-4 bg-orange-600 text-white border-none font-black text-[9px] uppercase">
                          {n.category}
                        </Badge>
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                          <Clock className="w-3 h-3" />
                          {new Date(n.date).toLocaleDateString('pt-BR')}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-orange-600 transition-colors leading-tight">
                          {n.title}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6">
                          {n.summary}
                        </p>
                        <div className="mt-auto flex items-center text-orange-600 font-black text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                          Ver detalhes <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {totalResults === 0 && (
              <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm px-6 max-w-4xl mx-auto">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter italic">Não encontramos resultados</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto mb-12 leading-relaxed">
                  Tente outro termo ou explore as categorias populares abaixo.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  {[
                    { label: "Pizzaria", icon: TrendingUp },
                    { label: "Eletricista", icon: Wrench },
                    { label: "Promoções", icon: Newspaper },
                    { label: "Pet Shop", icon: Store }
                  ].map((cat, i) => (
                    <button 
                      key={i}
                      onClick={() => { setSearchTerm(cat.label); navigate({ to: "/busca", search: { q: cat.label } }); }}
                      className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-orange-200 hover:bg-orange-50 transition-all flex flex-col items-center gap-3 group"
                    >
                      <cat.icon className="w-6 h-6 text-slate-300 group-hover:text-orange-600 transition-colors" />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900">{cat.label}</span>
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={() => { setSearchTerm(""); navigate({ to: "/busca", search: { q: "" } }); }}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 px-8 font-black transition-all"
                >
                  Ver Tudo
                </Button>
              </div>

            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
