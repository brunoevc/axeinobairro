import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { newsRepository } from "@/repositories/newsRepository";
import { merchantsRepository } from "@/repositories/merchantsRepository";
import { NewsItem } from "@/types/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, Share2, Tag, ArrowLeft } from "lucide-react";
import { getMerchantPublicPath } from "@/data/merchants";
import { TopBar } from "@/components/TopBar";

export const Route = createFileRoute("/noticias")({
  component: NoticiasPage,
});

function NoticiasPage() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const allNews = newsRepository.getAll().filter(n => n.isActive);
    setNews(allNews);
    
    allNews.forEach(item => {
      newsRepository.updateInteraction(item.id, "views");
    });
  }, []);

  const getMerchantName = (id?: string) => {
    if (!id) return null;
    return merchantsRepository.getById(id)?.name;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-12">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-orange-600 font-bold mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Home
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Notícias do Bairro</h1>
          <div className="h-1.5 w-20 bg-orange-600 mt-4 rounded-full" />
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news.map(item => (
                <article key={item.id} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-orange-600 text-white font-black uppercase text-[9px] px-2 py-0.5 rounded-lg">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-3">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                      {item.origin && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{item.origin}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2">{item.summary}</p>
                    
                    <div className="mt-auto">
                    {item.merchantId ? (
                      <Link 
                        to={getMerchantPublicPath(merchantsRepository.getById(item.merchantId) || { id: item.merchantId })}
                        className="inline-flex items-center text-orange-600 font-black text-xs uppercase tracking-wider group-hover:gap-2 transition-all"
                        onClick={() => newsRepository.updateInteraction(item.id, "clicks")}
                      >
                        Ver {getMerchantName(item.merchantId)}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : item.sourceUrl ? (
                      <a 
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 font-black text-xs uppercase tracking-wider group-hover:gap-2 transition-all"
                      >
                        Leia mais na fonte
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
              <h4 className="text-xl font-black mb-4">Divulgue Aqui</h4>
              <p className="text-slate-400 text-sm mb-6">Sua loja em destaque nas notícias mais lidas do bairro.</p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 font-bold h-12 rounded-xl">
                Seja um Parceiro
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}