import { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { getNews, trackNewsInteraction } from "@/lib/news";
import { merchants } from "@/data/merchants";
import { NewsItem } from "@/types/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Share2, Tag } from "lucide-react";

export default function Notícias() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const allNews = getNews().filter(n => n.isActive);
    
    // REGRA DE GOVERNANÇA: Evitar duplicidade visual da mesma loja
    // Se a mesma loja tem várias notícias, priorizamos o nível A > B > C
    const uniqueNewsByMerchant = new Map<string, NewsItem>();
    
    // Ordenamos por nível de exposição para garantir que o Map mantenha o melhor nível
    const sortedNews = [...allNews].sort((a, b) => {
      const order = { "A": 1, "B": 2, "C": 3 };
      return order[a.exposureLevel] - order[b.exposureLevel];
    });

    sortedNews.forEach(item => {
      if (!uniqueNewsByMerchant.has(item.merchantId)) {
        uniqueNewsByMerchant.set(item.merchantId, item);
      }
    });

    setNews(Array.from(uniqueNewsByMerchant.values()));
    
    // Track views
    Array.from(uniqueNewsByMerchant.values()).forEach(item => {
      trackNewsInteraction(item.id, "view");
    });
  }, []);

  const featured = news.filter(n => n.exposureLevel === "A");
  const subFeatured = news.filter(n => n.exposureLevel === "B");
  const others = news.filter(n => n.exposureLevel === "C");

  const getMerchantName = (id: string) => merchants.find(m => m.id === id)?.name || "Loja Parceira";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Notícias do Bairro</h1>
        <div className="h-1.5 w-20 bg-orange-600 mt-4 rounded-full" />
      </header>
      
      {/* BANNERS PRINCIPAIS (NÍVEL A) */}
      {featured.length > 0 && (
        <section className="mb-16">
          <div className="grid grid-cols-1 gap-8">
            {featured.map(item => (
              <div key={item.id} className="group relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[400px] bg-slate-900">
                <img 
                  src={item.imageUrl} 
                  className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" 
                  alt={item.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-8 md:p-12 flex flex-col justify-end">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-orange-600 hover:bg-orange-600 text-white font-black px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">
                      Patrocinado
                    </Badge>
                    <Badge variant="outline" className="text-white border-white/30 backdrop-blur-md uppercase text-[10px] font-bold">
                      {item.category}
                    </Badge>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight max-w-3xl">
                    {item.title}
                  </h2>
                  <p className="text-slate-200 text-lg mb-8 max-w-2xl line-clamp-2 md:line-clamp-none font-medium">
                    {item.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link 
                      to={merchants.find(m => m.id === item.merchantId)?.slug ? "/loja/$slug" : "/negocios/$id"}
                      params={merchants.find(m => m.id === item.merchantId)?.slug ? { slug: merchants.find(m => m.id === item.merchantId)!.slug! } : { id: item.merchantId }}
                      className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm hover:bg-orange-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg flex items-center gap-2"
                      onClick={() => trackNewsInteraction(item.id, "click")}
                    >
                      Ver {getMerchantName(item.merchantId)}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <span className="text-white/60 text-xs font-bold flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FEED SECUNDÁRIO E COMUM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* DESTAQUES NÍVEL B */}
          {subFeatured.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {subFeatured.map(item => (
                <article key={item.id} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 text-white font-black uppercase text-[9px] px-2 py-0.5 rounded-lg">Destaque</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-3">
                      <Tag className="w-3 h-3 text-orange-500" />
                      {item.category}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2">{item.summary}</p>
                    <Link 
                      to={merchants.find(m => m.id === item.merchantId)?.slug ? "/loja/$slug" : "/negocios/$id"}
                      params={merchants.find(m => m.id === item.merchantId)?.slug ? { slug: merchants.find(m => m.id === item.merchantId)!.slug! } : { id: item.merchantId }}
                      className="inline-flex items-center text-orange-600 font-black text-xs uppercase tracking-wider group-hover:gap-2 transition-all"
                      onClick={() => trackNewsInteraction(item.id, "click")}
                    >
                      Ver {getMerchantName(item.merchantId)}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* LISTA NÍVEL C */}
          <div className="space-y-8">
            <h4 className="text-xl font-black text-slate-900 border-b pb-4">Mais Notícias</h4>
            {others.map(item => (
              <article key={item.id} className="flex flex-col md:flex-row gap-6 group">
                <div className="w-full md:w-48 h-32 shrink-0 rounded-2xl overflow-hidden bg-slate-100">
                  <img src={item.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-1">{item.summary}</p>
                  <Link 
                    to={merchants.find(m => m.id === item.merchantId)?.slug ? "/loja/$slug" : "/negocios/$id"}
                    params={merchants.find(m => m.id === item.merchantId)?.slug ? { slug: merchants.find(m => m.id === item.merchantId)!.slug! } : { id: item.merchantId }}
                    className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-orange-600 transition-colors"
                    onClick={() => trackNewsInteraction(item.id, "click")}
                  >
                    Parceiro: {getMerchantName(item.merchantId)}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* SIDEBAR / INFO */}
        <aside className="space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h4 className="text-xl font-black mb-4">Divulgue Aqui</h4>
            <p className="text-slate-400 text-sm mb-6">Sua loja em destaque nas notícias mais lidas do bairro.</p>
            <Button className="w-full bg-orange-600 hover:bg-orange-700 font-bold h-12 rounded-xl">
              Seja um Parceiro
            </Button>
          </div>
          
          <div className="bg-orange-50 rounded-[2rem] p-8 border border-orange-100">
            <h4 className="text-xl font-black text-orange-900 mb-4">Newsletter</h4>
            <p className="text-orange-800/70 text-sm mb-6">Receba as novidades direto no seu WhatsApp.</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Seu número" className="bg-white border-orange-200 rounded-xl px-4 py-2 text-sm flex-1 outline-none focus:ring-2 ring-orange-500" />
              <Button size="icon" className="bg-orange-600 rounded-xl"><Share2 className="w-4 h-4" /></Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}