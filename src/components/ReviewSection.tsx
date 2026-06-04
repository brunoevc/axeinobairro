import { useState, useEffect } from "react";
import { Star, MessageSquare, Send, User } from "lucide-react";
import { Review, ReviewTargetType } from "@/types/reviews";
import { reviewsRepository } from "@/repositories/reviewsRepository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ReviewSectionProps {
  targetId: string;
  targetType: ReviewTargetType;
}

export function ReviewSection({ targetId, targetType }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ average: 0, total: 0 });
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const loadReviews = () => {
    setReviews(reviewsRepository.getByTarget(targetType, targetId));
    setStats(reviewsRepository.getAverageRating(targetType, targetId));
  };

  useEffect(() => {
    loadReviews();
  }, [targetId, targetType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      reviewsRepository.create({
        targetId,
        targetType,
        authorName: name,
        rating,
        comment
      });
      toast.success("Avaliação enviada com sucesso!");
      setName("");
      setRating(5);
      setComment("");
      setIsFormOpen(false);
      loadReviews();
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar avaliação");
    }
  };

  return (
    <div className="space-y-8 mt-12">
      {/* Header with Stats */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
            Avaliações da Comunidade
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="text-3xl font-black text-slate-900">{stats.average || 'Novo'}</div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`w-4 h-4 ${s <= Math.round(stats.average) ? 'text-orange-500 fill-orange-500' : 'text-slate-200 fill-slate-200'}`} 
                />
              ))}
            </div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              {stats.total} {stats.total === 1 ? 'avaliação' : 'avaliações'}
            </div>
          </div>
        </div>

        {!isFormOpen && (
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 px-6 font-black gap-2 transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-orange-500" />
            Avaliar agora
          </Button>
        )}
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="bg-orange-50/50 border border-orange-100 p-8 rounded-[2.5rem] animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-black text-slate-900">Sua Experiência</h4>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 font-bold hover:text-slate-600"
              >
                Cancelar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Seu Nome</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como você quer ser chamado?" 
                    className="pl-12 h-14 rounded-2xl border-orange-100 focus:border-orange-500 transition-all bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Nota (1 a 5 estrelas)</label>
                <div className="flex items-center gap-3 h-14 bg-white border border-orange-100 rounded-2xl px-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="transition-transform active:scale-125"
                    >
                      <Star 
                        className={`w-6 h-6 ${s <= rating ? 'text-orange-500 fill-orange-500' : 'text-slate-200'}`} 
                      />
                    </button>
                  ))}
                  <span className="ml-auto text-sm font-black text-orange-600 uppercase tracking-widest">
                    {rating === 1 ? 'Péssimo' : rating === 2 ? 'Ruim' : rating === 3 ? 'Regular' : rating === 4 ? 'Bom' : 'Excelente'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Seu Comentário</label>
              <Textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte para a vizinhança como foi sua experiência (mínimo 10 caracteres)..." 
                className="min-h-[120px] rounded-3xl border-orange-100 focus:border-orange-500 transition-all bg-white p-6 resize-none"
              />
            </div>

            <Button 
              type="submit"
              className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black shadow-xl shadow-orange-600/20 gap-2 transition-all active:scale-95"
            >
              <Send className="w-5 h-5" />
              Publicar Avaliação
            </Button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black">
                    {review.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 leading-none">{review.authorName}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-3 h-3 ${s <= review.rating ? 'text-orange-500 fill-orange-500' : 'text-slate-100 fill-slate-100'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed italic">
                "{review.comment}"
              </p>
            </div>
          ))
        ) : (
          <div className="py-12 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Nenhuma avaliação ainda</p>
            <p className="text-xs text-slate-400 mt-2">Seja o primeiro a avaliar!</p>
          </div>
        )}
      </div>
    </div>
  );
}
