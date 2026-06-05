import { useEffect, useState } from "react";
import { feedbackRepository, Feedback } from "@/repositories/feedbackRepository";
import { Trash2, MessageCircle, User, Calendar, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    setFeedbacks(feedbackRepository.getAll());
    return feedbackRepository.subscribe(() => {
      setFeedbacks(feedbackRepository.getAll());
    });
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Deseja realmente excluir este feedback?")) {
      feedbackRepository.delete(id);
      toast.success("Feedback excluído.");
    }
  };

  const filteredFeedbacks = feedbacks
    .filter(f => !filter || f.profile === filter)
    .sort((a, b) => b.createdAt - a.createdAt);

  const profiles = [
    { id: 'morador', label: 'Morador' },
    { id: 'comerciante', label: 'Comerciante' },
    { id: 'profissional', label: 'Profissional' },
    { id: 'motorista', label: 'Motorista' },
    { id: 'representante', label: 'Representante' },
    { id: 'lider_comunidade', label: 'Líder' },
  ];

  if (feedbacks.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center">
        <MessageCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Nenhum feedback ainda</h3>
        <p className="text-slate-400 text-sm">Os feedbacks dos usuários aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <div className="flex items-center gap-2 mr-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Filtrar:</span>
        </div>
        <Button 
          variant={filter === "" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setFilter("")}
          className="rounded-full text-[10px] font-black uppercase h-8"
        >
          Todos
        </Button>
        {profiles.map(p => (
          <Button 
            key={p.id}
            variant={filter === p.id ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter(p.id)}
            className="rounded-full text-[10px] font-black uppercase h-8"
          >
            {p.label}
          </Button>
        ))}
        {filter && (
          <button onClick={() => setFilter("")} className="ml-2 p-1 text-slate-400 hover:text-red-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredFeedbacks.map((item) => (
          <div key={item.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-100 text-[10px] font-black uppercase tracking-widest px-3">
                      {item.profile}
                    </Badge>
                    {item.whatsapp && (
                      <a 
                        href={`https://wa.me/55${item.whatsapp.replace(/\D/g, '')}`} 
                        target="_blank" 
                        className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs font-bold">{item.whatsapp}</span>
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-3 bg-red-50 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">O que gostou</p>
                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-sm font-medium text-slate-700 leading-relaxed">
                  {item.liked}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Não entendeu</p>
                <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl text-sm font-medium text-slate-700 leading-relaxed">
                  {item.notUnderstood}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">O que falta</p>
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-sm font-medium text-slate-700 leading-relaxed">
                  {item.missing}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
