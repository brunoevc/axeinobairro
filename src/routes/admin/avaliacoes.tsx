import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { reviewsRepository } from "@/repositories/reviewsRepository";
import { Review, ReviewTargetType } from "@/types/reviews";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Star, EyeOff, Eye, Trash2, Filter, AlertCircle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/avaliacoes")({
  component: AdminAvaliacoes,
});

function AdminAvaliacoes() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filters, setFilters] = useState({
    targetType: "all" as ReviewTargetType | "all",
    status: "all" as "visible" | "hidden" | "all"
  });

  const loadReviews = () => {
    let all = reviewsRepository.getAll();
    
    if (filters.targetType !== "all") {
      all = all.filter(r => r.targetType === filters.targetType);
    }
    
    if (filters.status === "visible") {
      all = all.filter(r => r.isVisible);
    } else if (filters.status === "hidden") {
      all = all.filter(r => !r.isVisible);
    }

    setReviews(all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  useEffect(() => {
    loadReviews();
  }, [filters]);

  const handleHide = (id: string) => {
    reviewsRepository.hide(id);
    toast.success("Avaliação ocultada com sucesso.");
    loadReviews();
  };

  const handleRestore = (id: string) => {
    reviewsRepository.restore(id);
    toast.success("Avaliação restaurada.");
    loadReviews();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir permanentemente esta avaliação?")) {
      reviewsRepository.delete(id);
      toast.success("Avaliação excluída.");
      loadReviews();
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">
            Gestão de <span className="text-orange-600">Avaliações</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Moderação de comentários e reputação da rede.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-2xl border border-orange-100 shadow-sm">
           <MessageSquare className="w-4 h-4 text-orange-600" />
           <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Painel de Moderação</span>
        </div>
      </header>

      {/* Filtros */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-slate-400">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">Filtros</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Tipo de Alvo</label>
            <Select value={filters.targetType} onValueChange={(val: any) => setFilters({ ...filters, targetType: val })}>
              <SelectTrigger className="h-14 rounded-2xl border-slate-100">
                <SelectValue placeholder="Tipo de Alvo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="loja">Loja</SelectItem>
                <SelectItem value="servico">Serviço</SelectItem>
                <SelectItem value="transporte">Transporte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Status</label>
            <Select value={filters.status} onValueChange={(val: any) => setFilters({ ...filters, status: val })}>
              <SelectTrigger className="h-14 rounded-2xl border-slate-100">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="visible">Visíveis</SelectItem>
                <SelectItem value="hidden">Ocultos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Lista de Avaliações */}
      <div className="grid grid-cols-1 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div 
              key={review.id} 
              className={`bg-white p-8 rounded-[2.5rem] border shadow-sm transition-all group relative overflow-hidden ${review.isVisible ? 'border-slate-100' : 'border-red-100 bg-red-50/20 opacity-80'}`}
            >
              {!review.isVisible && (
                <div className="absolute top-0 right-0 px-4 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-bl-xl border-l border-b border-red-200">
                   Oculta do Público
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className={`text-[10px] font-black uppercase px-3 py-1 border-slate-200 ${review.targetType === 'loja' ? 'text-blue-600' : review.targetType === 'servico' ? 'text-emerald-600' : 'text-violet-600'}`}>
                      {review.targetType}
                    </Badge>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID do Alvo: {review.targetId}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{new Date(review.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {review.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none mb-1">{review.authorName}</h3>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-4 h-4 ${s <= review.rating ? 'text-orange-500 fill-orange-500' : 'text-slate-100 fill-slate-100'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 font-medium text-lg leading-relaxed bg-slate-50 p-6 rounded-2xl italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex lg:flex-col gap-3 min-w-[200px]">
                  {review.isVisible ? (
                    <Button 
                      onClick={() => handleHide(review.id)}
                      className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-100 rounded-2xl h-14 font-black gap-2 transition-all active:scale-95 shadow-sm"
                    >
                      <EyeOff className="w-4 h-4" />
                      Ocultar
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleRestore(review.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 font-black gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-100"
                    >
                      <Eye className="w-4 h-4" />
                      Restaurar
                    </Button>
                  )}
                  <Button 
                    variant="ghost"
                    onClick={() => handleDelete(review.id)}
                    className="flex-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl h-14 font-black gap-2 transition-all active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Nenhuma avaliação para moderar</h3>
            <p className="text-slate-500 font-medium">Os filtros aplicados não retornaram resultados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
