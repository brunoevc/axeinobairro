import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { getNews, trackNewsInteraction } from "@/lib/news";
import { merchants } from "@/data/merchants";
import { NewsItem } from "@/types/news";

export default function Notícias() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    setNews(getNews().filter(n => n.isActive));
  }, []);

  const featured = news.filter(n => n.exposureLevel === "A");
  const others = news.filter(n => n.exposureLevel !== "A");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Notícias do Bairro</h1>
      
      {featured.length > 0 && (
        <div className="mb-12">
          {featured.map(item => (
            <div key={item.id} className="relative rounded-3xl overflow-hidden shadow-2xl h-[300px]">
              <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded w-fit uppercase mb-2">Patrocinado</span>
                <h2 className="text-2xl font-black">{item.title}</h2>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {others.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <img src={item.imageUrl} className="w-full h-40 object-cover rounded-xl mb-4" />
            <h3 className="font-bold text-lg text-slate-900 mb-1">{item.title}</h3>
            <p className="text-sm text-slate-500 mb-4">{item.summary}</p>
            <Link 
              to="/negocios" 
              className="text-orange-600 font-bold text-sm hover:underline"
              onClick={() => trackNewsInteraction(item.id, "click")}
            >
              Ver loja patrocinadora
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
