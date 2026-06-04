import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { 
  Search, 
  MapPin, 
  Tag, 
  ChevronRight, 
  Filter, 
  PlusCircle, 
  LayoutGrid, 
  AlertTriangle,
  MessageCircle,
  X
} from "lucide-react";
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
import { classifiedsRepository } from "@/repositories/classifiedsRepository";
import { neighborhoods } from "@/data/merchants";
import { ClassifiedAd, ClassifiedCategory } from "@/types/classifieds";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

const CATEGORIES: ClassifiedCategory[] = [
  'imóveis', 
  'veículos', 
  'casa & eletro', 
  'eletrônicos', 
  'moda & beleza', 
  'hobby & lazer', 
  'diversos'
];

export const Route = createFileRoute("/classificados")({
  component: ClassifiedsPage,
});

function ClassifiedsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [neighborhood, setNeighborhood] = useState<string>("all");
  const [selectedAd, setSelectedAd] = useState<ClassifiedAd | null>(null);

  const ads = useMemo(() => classifiedsRepository.getActive(), []);

  const filteredAds = useMemo(() => {
    return ads.filter(ad => {
      const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ad.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === "all" || ad.category === category;
      const matchesNeighborhood = neighborhood === "all" || ad.neighborhood === neighborhood;
      return matchesSearch && matchesCategory && matchesNeighborhood;
    });
  }, [ads, searchTerm, category, neighborhood]);

  const handleReport = (ad: ClassifiedAd) => {
    const reason = prompt("Por que você deseja denunciar este anúncio?");
    if (reason) {
      classifiedsRepository.report({
        id: Math.random().toString(36).substr(2, 9),
        adId: ad.id,
        reason,
        createdAt: new Date().toISOString()
      });
      toast.success("Denúncia enviada para análise.");
    }
  };

  const openWhatsApp = (ad: ClassifiedAd) => {
    const message = `Olá, vi seu anúncio "${ad.title}" no Axêi no Bairro e tenho interesse.`;
    window.open(`https://wa.me/${ad.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <TopBar />

      {/* Header */}
      <section className="bg-white border-b border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4">
              Classificados do <span className="text-orange-600">Bairro</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto md:mx-0">
              Encontre oportunidades únicas perto de você. De móveis a veículos, tudo em um só lugar.
            </p>
          </div>
          <Button 
            onClick={() => navigate({ to: '/painel/morador' })}
            className="h-14 px-8 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black shadow-xl shadow-orange-200"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Anunciar Agora
          </Button>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white border border-slate-100 p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="O que você procura?"
              className="pl-11 h-12 rounded-xl border-slate-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12 rounded-xl border-slate-100">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={neighborhood} onValueChange={setNeighborhood}>
            <SelectTrigger className="h-12 rounded-xl border-slate-100">
              <SelectValue placeholder="Bairro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Bairros</SelectItem>
              {neighborhoods.map(n => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-slate-400 text-sm font-bold px-4">
            <LayoutGrid className="w-4 h-4" />
            {filteredAds.length} anúncios encontrados
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {filteredAds.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Nenhum anúncio encontrado</h3>
            <p className="text-slate-500 font-medium">Tente ajustar seus filtros de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAds.map((ad) => (
              <Card 
                key={ad.id} 
                className="group overflow-hidden rounded-[2rem] border-slate-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-200/20 transition-all cursor-pointer"
                onClick={() => setSelectedAd(ad)}
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                  {ad.images[0] ? (
                    <img 
                      src={ad.images[0]} 
                      alt={ad.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Tag className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-white/90 text-slate-900 backdrop-blur-sm border-none font-black text-[10px] uppercase">
                      {ad.category}
                    </Badge>
                  </div>
                  {ad.planType === 'community' && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-orange-600 text-white border-none font-black text-[10px] uppercase shadow-lg">
                        Verificado
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <MapPin className="w-3 h-3" />
                    {ad.neighborhood}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-orange-600 transition-colors">
                    {ad.title}
                  </h3>
                  <div className="text-2xl font-black text-slate-900 tracking-tighter">
                    {ad.price === 0 ? "Grátis" : formatCurrency(ad.price)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedAd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative">
            <button 
              onClick={() => setSelectedAd(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all text-slate-400 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-slate-100 aspect-square md:aspect-auto">
                {selectedAd.images.length > 0 ? (
                  <div className="h-full flex flex-col gap-2 p-2">
                    <img src={selectedAd.images[0]} alt={selectedAd.title} className="w-full h-full object-cover rounded-2xl" />
                    {selectedAd.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedAd.images.slice(1).map((img, i) => (
                          <img key={i} src={img} className="aspect-square object-cover rounded-lg border border-white" />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Tag className="w-24 h-24" />
                  </div>
                )}
              </div>

              <div className="p-8 md:p-12">
                <div className="flex items-center gap-2 mb-6">
                  <Badge variant="outline" className="rounded-lg border-slate-200 font-bold uppercase tracking-widest text-[10px]">
                    {selectedAd.category}
                  </Badge>
                  {selectedAd.planType === 'community' && (
                    <Badge className="bg-orange-600 text-white border-none rounded-lg font-black uppercase tracking-widest text-[10px]">
                      Verificado
                    </Badge>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 mb-4 leading-none">
                  {selectedAd.title}
                </h2>

                <div className="text-3xl font-black text-orange-600 tracking-tighter mb-8">
                  {selectedAd.price === 0 ? "Grátis" : formatCurrency(selectedAd.price)}
                </div>

                <div className="space-y-6 mb-10">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Localização</h4>
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      {selectedAd.neighborhood}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Descrição</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      {selectedAd.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Anunciante</h4>
                    <p className="text-slate-900 font-bold">{selectedAd.userName}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={() => openWhatsApp(selectedAd)}
                    className="h-16 w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200"
                  >
                    <MessageCircle className="mr-2 h-6 w-6" />
                    Chamar no WhatsApp
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleReport(selectedAd)}
                    className="h-12 w-full text-slate-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Denunciar Anúncio
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <FloatingNav />
    </div>
  );
}
