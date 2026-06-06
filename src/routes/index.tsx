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
  Croissant,
  PawPrint,
  MapPin,
  ArrowUpRight,
  PlusCircle,
  ShieldCheck,
  Award
} from "lucide-react";

import { merchantsRepository } from "@/repositories/merchantsRepository";
import { servicesRepository } from "@/repositories/servicesRepository";
import { newsRepository } from "@/repositories/newsRepository";
import { MerchantCard } from "@/components/MerchantCard";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "@/hooks/useLocation";
import { Footer } from "@/components/Footer";
import { SponsorSection } from "@/components/SponsorSection";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Axêi no Bairro — Portal da Sua Comunidade" },
      { name: "description", content: "Tudo que você precisa, pertinho de você. Comércio, serviços, notícias e eventos da nossa comunidade." },
    ],
  }),
});

function Index() {
  const navigate = useNavigate();
  const [merchants, setMerchants] = useState(() => merchantsRepository.getAll());
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const unsubscribe = merchantsRepository.subscribe(() => setMerchants(merchantsRepository.getAll()));
    return () => unsubscribe();
  }, []);

  const promotionalMerchants = useMemo(() => merchants.filter(m => m.promotion.isActive).slice(0, 4), [merchants]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100">
      <TopBar />
      
      <main className="max-w-[1440px] mx-auto pt-6 px-4 md:px-6">
        {/* HERO */}
        <section className="bg-white rounded-[2.5rem] p-6 md:p-12 mb-8 border border-slate-100 shadow-sm">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4 leading-[0.9]">
              Tudo que você precisa, <span className="text-orange-600">pertinho de você.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-8 font-medium">
              Comércio, serviços, notícias, eventos e muito mais da nossa comunidade.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); navigate({ to: '/negocios', search: { q: searchTerm } }); }} className="relative group max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar comércios, serviços ou eventos..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-14 pr-32 text-base font-medium outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-8 bg-slate-900 hover:bg-slate-800 rounded-xl font-black text-xs uppercase tracking-widest">Buscar</Button>
            </form>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* QUICK CATEGORIES */}
            <section>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Categorias Rápidas</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {[
                  { label: 'Lojas', icon: Tag, path: '/negocios' },
                  { label: 'Serviços', icon: Wrench, path: '/servicos' },
                  { label: 'Transporte', icon: Car, path: '/transporte' },
                  { label: 'Ofertas', icon: Flame, path: '/negocios' },
                  { label: 'Notícias', icon: Newspaper, path: '/noticias' },
                  { label: 'Comunidade', icon: Star, path: '/noticias' },
                ].map(cat => (
                  <button key={cat.label} onClick={() => navigate({ to: cat.path as any })} className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-3 hover:border-orange-200 hover:shadow-lg transition-all group">
                    <cat.icon className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase text-slate-600">{cat.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* OFERTAS */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Ofertas do Bairro</h2>
                <Button variant="ghost" onClick={() => navigate({ to: '/negocios' })} className="text-orange-600 font-black uppercase text-xs">Ver tudo</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {promotionalMerchants.map(m => <MerchantCard key={m.id} merchant={m} />)}
              </div>
            </section>

          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-8">
              <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
                <h3 className="text-sm font-black uppercase text-slate-400 mb-6 tracking-widest">Acontecendo Agora</h3>
                <div className="space-y-6">
                  {newsRepository.getAll().slice(0, 3).map(n => (
                    <div key={n.id} className="group cursor-pointer" onClick={() => navigate({ to: '/noticias' })}>
                      <p className="text-orange-400 text-[10px] font-black uppercase mb-1">{n.category}</p>
                      <h4 className="font-bold text-white group-hover:text-orange-400 transition-colors">{n.title}</h4>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                     <PlusCircle />
                   </div>
                   <h3 className="font-black text-slate-900">Seja um Parceiro</h3>
                </div>
                <p className="text-slate-500 text-sm mb-6">Destaque sua empresa para milhares de moradores locais.</p>
                <Button className="w-full bg-slate-900">Anunciar agora</Button>
              </section>
            </div>
          </aside>
        </div>

        <SponsorSection />
      </main>
      <Footer />
      <FloatingNav />
    </div>
  );
}
