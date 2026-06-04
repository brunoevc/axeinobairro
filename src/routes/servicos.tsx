import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/servicos")({
  component: Servicos,
});
import { servicesRepository } from "@/repositories/servicesRepository";
import { localBoostsRepository } from "@/repositories/localBoostsRepository";
import { reviewsRepository } from "@/repositories/reviewsRepository";
import { ServiceProvider, ServiceCategory } from "@/types/services";
import { ReviewSection } from "@/components/ReviewSection";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, ShieldAlert, Search, Filter, Star, MapPin, Briefcase, CheckCircle2, Award } from "lucide-react";
import { neighborhoods } from "@/data/merchants";

const categories: ServiceCategory[] = [
  'eletricista', 'encanador', 'pedreiro', 'pintor', 'diarista', 'jardineiro',
  'montador de móveis', 'técnico de informática', 'técnico de celular',
  'chaveiro', 'costureira', 'professor particular', 'cuidador de idosos', 'passeador de cães'
];

export default function Servicos() {
  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [filters, setFilters] = useState({
    neighborhood: "all",
    category: "all",
    onlyAvailable: false,
  });

  useEffect(() => {
    let filtered = servicesRepository.getAll();

    if (filters.category !== "all") {
      filtered = filtered.filter(s => s.category === filters.category);
    }
    
    if (filters.neighborhood !== "all") {
      filtered = filtered.filter(s => 
        s.neighborhood === filters.neighborhood || 
        (s.serviceArea && s.serviceArea.includes(filters.neighborhood))
      );
    }
    
    if (filters.onlyAvailable) {
      filtered = filtered.filter(s => s.isAvailable);
    }

    // Phase 8.7: Apply Boosts via central repository
    filtered = localBoostsRepository.sortByBoost(filtered, 'servico', 'id');


    setServices(filtered);
  }, [filters]);


  const handleWhatsApp = (provider: ServiceProvider) => {
    const message = "Olá, encontrei seu anúncio no Axéí no Bairro e gostaria de solicitar um orçamento.";
    const link = servicesRepository.formatWhatsAppLink(provider.phone, message);
    window.open(link, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Serviços da Comunidade</h1>
        <div className="h-1.5 w-20 bg-orange-600 mt-4 rounded-full" />
        <p className="text-slate-500 mt-4 font-medium">Encontre os melhores profissionais da sua região.</p>
      </header>

      <div className="bg-slate-900 text-white p-6 rounded-3xl mb-12 flex items-start gap-4 border-l-8 border-orange-600 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <ShieldAlert className="w-24 h-24 text-orange-600" />
        </div>
        <ShieldAlert className="w-8 h-8 text-orange-600 shrink-0 mt-1" />
        <div className="relative z-10">
          <p className="text-base font-bold leading-relaxed">
            <span className="font-black uppercase text-orange-600 mr-2 tracking-wider">Aviso de Segurança:</span>
            O Axéí no Bairro conecta moradores e profissionais locais. Negocie valores, prazos e condições diretamente com o prestador. Recomendamos solicitar referências para serviços em sua residência.
          </p>
        </div>
      </div>

      <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-12">
        <div className="flex items-center gap-2 mb-6 text-slate-400">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">Filtros</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={filters.category} onValueChange={(val) => setFilters({ ...filters, category: val })}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.neighborhood} onValueChange={(val) => setFilters({ ...filters, neighborhood: val })}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Bairro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os bairros</SelectItem>
              {neighborhoods.map(hood => (
                <SelectItem key={hood} value={hood}>{hood}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant={filters.onlyAvailable ? "default" : "outline"}
            onClick={() => setFilters({ ...filters, onlyAvailable: !filters.onlyAvailable })}
            className={`h-12 rounded-xl font-bold ${filters.onlyAvailable ? 'bg-orange-600' : ''}`}
          >
            Disponível agora
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length > 0 ? (
          services.map((provider) => {
            const activeBoost = localBoostsRepository.getActiveBoostForTarget('servico', provider.id);
            const isBoosted = !!activeBoost;

            return (
              <Card 
                key={provider.id} 
                className={`rounded-3xl border-slate-100 hover:shadow-xl transition-all duration-300 group overflow-hidden relative flex flex-col ${isBoosted ? 'border-2 border-orange-200 shadow-orange-100' : ''}`}
              >
                {isBoosted && (
                  <div className="absolute top-4 right-4 z-10 bg-orange-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1 border border-white uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-white" />
                    Destaque
                  </div>
                )}
                <CardContent className="p-6 flex-1 flex flex-col">

                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${provider.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        {provider.isAvailable ? "Disponível" : "Indisponível"}
                      </span>
                    </div>
                    {provider.verified && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Verificado</span>
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase py-1 border-slate-200 capitalize">
                    {provider.category}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900 group-hover:text-orange-600 transition-colors">{provider.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-orange-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold">
                          {(() => {
                            const { average, total } = reviewsRepository.getAverageRating('servico', provider.id);
                            return total > 0 ? average : 'Novo';
                          })()}
                        </span>
                      </div>
                      {(() => {
                        const { average, total } = reviewsRepository.getAverageRating('servico', provider.id);
                        if (average >= 4.5 && total > 5) return <Badge className="bg-emerald-100 text-emerald-600 border-emerald-200 text-[8px] font-black uppercase px-1.5 py-0">Excelente</Badge>;
                        if (average >= 4.0 && total > 3) return <Badge className="bg-blue-100 text-blue-600 border-blue-200 text-[8px] font-black uppercase px-1.5 py-0">Bem Avaliado</Badge>;
                        if (total <= 3) return <Badge className="bg-slate-100 text-slate-500 border-slate-200 text-[8px] font-black uppercase px-1.5 py-0">Novo</Badge>;
                        return null;
                      })()}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-xs flex flex-col gap-2 bg-slate-50 p-3 rounded-xl font-bold">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-3 h-3 text-orange-600" />
                      {provider.neighborhood}
                      {provider.serviceArea && provider.serviceArea.length > 0 && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          + {provider.serviceArea.join(', ')}
                        </span>
                      )}
                    </div>
                    {provider.priceNote && (
                      <div className="text-orange-600 flex items-center gap-2 border-t border-slate-100 pt-2">
                        <span className="text-[10px] uppercase font-black">Preço:</span>
                        <span className="text-xs">{provider.priceNote}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {provider.description}
                  </p>
                </div>

                <div className="mt-auto space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 gap-2">
                        <Star className="w-4 h-4 text-orange-500" />
                        Ver Avaliações
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-8">
                      <ReviewSection targetId={provider.id} targetType="servico" />
                    </DialogContent>
                  </Dialog>

                  <Button 
                    onClick={() => handleWhatsApp(provider)}
                    className="w-full bg-orange-600 hover:bg-orange-700 h-14 rounded-2xl font-black text-white shadow-lg shadow-orange-600/20 flex items-center gap-2 transition-transform hover:-translate-y-1"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Solicitar Orçamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })


        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Nenhum profissional encontrado</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Tente mudar os filtros ou procure novamente mais tarde.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setFilters({ neighborhood: "all", category: "all", onlyAvailable: false })}
              className="rounded-xl border-slate-200 font-bold"
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
