import { useState, useEffect } from "react";
import { getNews, saveNews } from "@/lib/news";
import { merchants } from "@/data/merchants";
import { NewsItem } from "@/types/news";

export default function AdminNoticias() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [formData, setFormData] = useState({ title: "", merchantId: "", exposureLevel: "C" as "A" | "B" | "C" });

  useEffect(() => { setNews(getNews()); }, []);

  const isSponsorEligible = (m: any) => ["verificado", "partner", "verified", "partner"].includes(m.status);

  const eligibleMerchants = merchants.filter(isSponsorEligible);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-black mb-6">Gerenciar Notícias</h1>
      <div className="bg-white p-6 rounded-xl border mb-8">
        <select onChange={(e) => setFormData({...formData, merchantId: e.target.value})} className="w-full p-2 border rounded mb-4">
          <option value="">Escolha loja patrocinadora</option>
          {eligibleMerchants.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <button onClick={() => {
           const newItem: NewsItem = { id: Date.now().toString(), ...formData as any, isActive: true, views: 0, clicks: 0, date: new Date().toISOString(), category: "promocoes", summary: "Resumo...", content: "Conteúdo...", imageUrl: "" };
           const updated = [...news, newItem];
           setNews(updated);
           saveNews(updated);
        }} className="bg-orange-600 text-white px-4 py-2 rounded">Criar Notícia</button>
      </div>

      <div className="space-y-4">
        {news.map(n => (
          <div key={n.id} className="flex justify-between items-center p-4 border rounded">
            <span>{n.title}</span>
            <span>Views: {n.views} | Clicks: {n.clicks}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
