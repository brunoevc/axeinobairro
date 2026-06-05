import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { recommendationsRepository } from "@/repositories/recommendationsRepository";
import { Recommendation, RecommendationCategory } from "@/types/recommendations";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ExternalLink, Sparkles, AlertCircle, ShoppingBag } from "lucide-react";

const CATEGORIES: { label: string; value: RecommendationCategory | 'all' }[] = [
  { label: 'Todas as Categorias', value: 'all' },
  { label: 'Casa', value: 'casa' },
  { label: 'Tecnologia', value: 'tecnologia' },
  { label: 'Beleza', value: 'beleza' },
  { label: 'Cozinha', value: 'cozinha' },
  { label: 'Ferramentas', value: 'ferramentas' },
  { label: 'Cursos', value: 'cursos' },
  { label: 'Serviços Online', value: 'serviços online' },
  { label: 'Ofertas', value: 'ofertas' },
  { label: 'Outros', value: 'outros' }
];

export const Route = createFileRoute("/recomendacoes")({
  component: RecomendacoesPage,
});

function RecomendacoesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<RecommendationCategory | 'all'>("all");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    setRecommendations(recommendationsRepository.getActive());
    const unsubscribe = recommendationsRepository.subscribe(() => {
      setRecommendations(recommendationsRepository.getActive());
    });
    return unsubscribe;
  }, []);

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           rec.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === "all" || rec.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [recommendations, searchTerm, category]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <TopBar />

      <header className="bg-white border-b border-slate-100 py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60" />
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-100">
            <Sparkles className="h-3.5 w-3.5" />
            Curadoria Axêi
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6 leading-none">
            Dicas e <span className="text-orange-600">Recomendações</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Produtos e oportunidades selecionadas para facilitar o dia a dia da comunidade. 
            Indicações de confiança com as melhores ofertas.
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white border border-slate-100 p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <Input 
              placeholder="O que você está procurando?"
              className="pl-11 h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={category} onValueChange={(val: any) => setCategory(val)}>
            <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 mb-12 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-amber-800 text-sm font-medium leading-relaxed">
            <span className="font-bold">Nota de Transparência:</span> Alguns links contidos nesta página podem gerar uma pequena comissão para o Axêi no Bairro, sem nenhum custo adicional para você. Isso nos ajuda a manter a plataforma gratuita para todos os usuários locais.
          </p>
        </div>

        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Nenhuma recomendação encontrada</h3>
            <p className="text-slate-500 font-medium">Tente buscar por outro termo ou categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecommendations.map((rec) => (
              <Card 
                key={rec.id} 
                className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 h-full"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  {rec.imageUrl ? (
                    <img 
                      src={rec.imageUrl} 
                      alt={rec.title} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ShoppingBag className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-black text-[10px] uppercase px-3 py-1">
                      {rec.category}
                    </Badge>
                  </div>
                  {rec.isSponsored && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-orange-600 text-white border-none font-black text-[10px] uppercase shadow-lg px-3 py-1">
                        Patrocinado
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-8 flex-1 flex flex-col">
                  {rec.sourceName && (
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">
                      Fonte: {rec.sourceName}
                    </span>
                  )}
                  <h3 className="text-2xl font-black text-slate-900 leading-tight mb-3 group-hover:text-orange-600 transition-colors">
                    {rec.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                    {rec.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50 flex flex-col gap-4">
                    {rec.priceNote && (
                      <div className="text-orange-600 font-black text-lg tracking-tight">
                        {rec.priceNote}
                      </div>
                    )}
                    <Button 
                      asChild
                      className="w-full h-14 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 group/btn"
                    >
                      <a href={rec.affiliateUrl} target="_blank" rel="noopener noreferrer">
                        Ver Recomendação
                        <ExternalLink className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <FloatingNav />
    </div>
  );
}
