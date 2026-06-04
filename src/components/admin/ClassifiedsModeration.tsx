import { useState, useMemo } from "react";
import { 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Search
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { classifiedsRepository } from "@/repositories/classifiedsRepository";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { ClassifiedAd } from "@/types/classifieds";

export default function ClassifiedsModeration() {
  const [ads, setAds] = useState(() => classifiedsRepository.getAll());
  const [searchTerm, setSearchTerm] = useState("");

  const refreshAds = () => {
    setAds(classifiedsRepository.getAll());
  };

  const filteredAds = useMemo(() => {
    return ads.filter(ad => 
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.userName.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => (b.reports || 0) - (a.reports || 0));
  }, [ads, searchTerm]);

  const toggleStatus = (ad: ClassifiedAd) => {
    const newStatus = ad.status === 'blocked' ? 'active' : 'blocked';
    classifiedsRepository.save({ ...ad, status: newStatus });
    toast.success(`Anúncio ${newStatus === 'blocked' ? 'bloqueado' : 'desbloqueado'}.`);
    refreshAds();
  };

  const deleteAd = (id: string) => {
    if (confirm("Excluir permanentemente este anúncio?")) {
      classifiedsRepository.delete(id);
      toast.success("Anúncio removido.");
      refreshAds();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Moderação de <span className="text-orange-600">Classificados</span>
          </h2>
          <p className="text-slate-500 font-medium">Gerencie anúncios denunidacos ou irregulares.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar anúncio ou usuário..."
            className="pl-11 h-12 rounded-2xl bg-white border-slate-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredAds.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-slate-200 rounded-[2rem]">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhum anúncio para moderar</p>
          </Card>
        ) : (
          filteredAds.map(ad => (
            <Card key={ad.id} className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-48 aspect-video bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                    {ad.images[0] ? (
                      <img src={ad.images[0]} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-xs uppercase">Sem Foto</div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[9px] uppercase font-black">{ad.category}</Badge>
                      {ad.status === 'blocked' && (
                        <Badge className="bg-red-500 text-white border-none text-[9px] uppercase font-black">Bloqueado</Badge>
                      )}
                      {(ad.reports || 0) > 0 && (
                        <Badge className="bg-orange-100 text-orange-600 border-none text-[9px] uppercase font-black">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {ad.reports} Denúncias
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="text-lg font-black text-slate-900 leading-tight">{ad.title}</h4>
                    <p className="text-sm font-medium text-slate-500 line-clamp-1">{ad.description}</p>
                    
                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Usuário: <span className="text-slate-900">{ad.userName}</span>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Preço: <span className="text-orange-600">{formatCurrency(ad.price)}</span>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Plano: <span className={ad.planType === 'community' ? 'text-violet-600' : 'text-slate-900'}>{ad.planType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0">
                    <Button 
                      variant="outline" 
                      className={`h-10 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                        ad.status === 'blocked' ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 'text-orange-600 border-orange-100 bg-orange-50'
                      }`}
                      onClick={() => toggleStatus(ad)}
                    >
                      {ad.status === 'blocked' ? <CheckCircle className="w-4 h-4 mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                      {ad.status === 'blocked' ? "Desbloquear" : "Bloquear"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-10 rounded-xl border-red-100 bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-widest"
                      onClick={() => deleteAd(ad.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="h-10 rounded-xl text-slate-400 font-black text-[10px] uppercase tracking-widest"
                      asChild
                    >
                      <a href={`/classificados`} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Site
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
