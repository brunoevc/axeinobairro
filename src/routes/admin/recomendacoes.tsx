import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { recommendationsRepository } from "@/repositories/recommendationsRepository";
import { Recommendation, RecommendationCategory } from "@/types/recommendations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  ShoppingBag,
  Save,
  X,
  Sparkles,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORIES: RecommendationCategory[] = [
  'casa', 'tecnologia', 'beleza', 'cozinha', 'ferramentas', 'cursos', 'serviços online', 'ofertas', 'outros'
];

export const Route = createFileRoute("/admin/recomendacoes")({
  component: AdminRecommendations,
});

function AdminRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRec, setCurrentRec] = useState<Partial<Recommendation>>({
    title: "",
    description: "",
    category: "outros",
    imageUrl: "",
    affiliateUrl: "",
    sourceName: "",
    priceNote: "",
    isActive: true,
    isSponsored: false
  });

  useEffect(() => {
    setRecommendations(recommendationsRepository.getAll());
    const unsubscribe = recommendationsRepository.subscribe(() => {
      setRecommendations(recommendationsRepository.getAll());
    });
    return unsubscribe;
  }, []);

  const handleSave = () => {
    if (!currentRec.title || !currentRec.affiliateUrl || !currentRec.category) {
      toast.error("Preencha os campos obrigatórios (Título, Link e Categoria)");
      return;
    }

    if (currentRec.id) {
      recommendationsRepository.update(currentRec.id, currentRec);
      toast.success("Recomendação atualizada!");
    } else {
      recommendationsRepository.create(currentRec as any);
      toast.success("Recomendação criada!");
    }

    setIsEditing(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentRec({
      title: "",
      description: "",
      category: "outros",
      imageUrl: "",
      affiliateUrl: "",
      sourceName: "",
      priceNote: "",
      isActive: true,
      isSponsored: false
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta recomendação?")) {
      recommendationsRepository.delete(id);
      toast.success("Excluído com sucesso!");
    }
  };

  const toggleStatus = (rec: Recommendation) => {
    recommendationsRepository.update(rec.id, { isActive: !rec.isActive });
    toast.success(rec.isActive ? "Desativado" : "Ativado");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">
            Gestão de <span className="text-orange-600">Recomendações</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Gerencie links afiliados e dicas para a comunidade.
          </p>
        </div>
        
        {!isEditing && (
          <Button 
            onClick={() => { resetForm(); setIsEditing(true); }}
            className="rounded-2xl h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-black gap-2 shadow-xl shadow-slate-100 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Nova Recomendação
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">
                  {currentRec.id ? "Editar Recomendação" : "Cadastrar Nova Dica"}
                </h2>
              </div>
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl h-10 w-10 p-0 hover:bg-slate-50">
                <X className="w-5 h-5 text-slate-400" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Título da Recomendação *</label>
                  <Input 
                    value={currentRec.title}
                    onChange={(e) => setCurrentRec({ ...currentRec, title: e.target.value })}
                    placeholder="Ex: Kindle Paperwhite 16GB"
                    className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white text-lg font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Link de Afiliado *</label>
                  <Input 
                    value={currentRec.affiliateUrl}
                    onChange={(e) => setCurrentRec({ ...currentRec, affiliateUrl: e.target.value })}
                    placeholder="https://amzn.to/..."
                    className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Categoria *</label>
                    <Select value={currentRec.category} onValueChange={(val: any) => setCurrentRec({ ...currentRec, category: val })}>
                      <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Loja/Fonte</label>
                    <Input 
                      value={currentRec.sourceName}
                      onChange={(e) => setCurrentRec({ ...currentRec, sourceName: e.target.value })}
                      placeholder="Ex: Amazon"
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Nota de Preço (Opcional)</label>
                  <Input 
                    value={currentRec.priceNote}
                    onChange={(e) => setCurrentRec({ ...currentRec, priceNote: e.target.value })}
                    placeholder="Ex: Menor preço em 30 dias"
                    className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Descrição / Por que recomendar?</label>
                  <Textarea 
                    value={currentRec.description}
                    onChange={(e) => setCurrentRec({ ...currentRec, description: e.target.value })}
                    placeholder="Descreva as vantagens deste produto ou serviço..."
                    className="min-h-[140px] rounded-2xl border-slate-100 bg-slate-50 focus:bg-white text-sm font-medium leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">URL da Imagem</label>
                  <Input 
                    value={currentRec.imageUrl}
                    onChange={(e) => setCurrentRec({ ...currentRec, imageUrl: e.target.value })}
                    placeholder="https://imagem.com/foto.jpg"
                    className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white font-mono text-sm"
                  />
                </div>

                <div className="flex gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={currentRec.isSponsored}
                      onChange={(e) => setCurrentRec({ ...currentRec, isSponsored: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">Patrocinado</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Exibir selo de destaque</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={currentRec.isActive}
                      onChange={(e) => setCurrentRec({ ...currentRec, isActive: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">Ativo</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Visível no site</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col md:flex-row gap-4">
              <Button 
                onClick={handleSave}
                className="flex-1 h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black shadow-xl shadow-orange-100 transition-all active:scale-95"
              >
                <Save className="w-5 h-5 mr-2" />
                Salvar Recomendação
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="h-14 px-10 rounded-2xl border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {recommendations.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
               <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <ShoppingBag className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 italic">Nenhuma recomendação cadastrada</h3>
               <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">Comece a cadastrar links afiliados para rentabilizar a plataforma.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/50">
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Item</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Categoria</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Status</th>
                      <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recommendations.map(rec => (
                      <tr key={rec.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                              {rec.imageUrl ? (
                                <img src={rec.imageUrl} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <ShoppingBag className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 italic leading-none mb-1">{rec.title}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rec.sourceName || 'Sem fonte'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-black text-[10px] uppercase px-2.5 py-1">
                            {rec.category}
                          </Badge>
                          {rec.isSponsored && (
                            <Badge className="ml-2 bg-orange-100 text-orange-600 border-none font-black text-[10px] uppercase px-2.5 py-1">
                              Patrocinado
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-6">
                           <button 
                            onClick={() => toggleStatus(rec)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${rec.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                           >
                              <div className={`w-1.5 h-1.5 rounded-full ${rec.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                              <span className="text-[10px] font-black uppercase tracking-wider">{rec.isActive ? 'Ativo' : 'Inativo'}</span>
                           </button>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              onClick={() => { setCurrentRec(rec); setIsEditing(true); }}
                              className="w-10 h-10 p-0 rounded-xl hover:bg-white hover:text-orange-600 shadow-sm border border-transparent hover:border-slate-100"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              asChild
                              className="w-10 h-10 p-0 rounded-xl hover:bg-white hover:text-blue-600 shadow-sm border border-transparent hover:border-slate-100"
                            >
                              <a href={rec.affiliateUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                            <Button 
                              variant="ghost" 
                              onClick={() => handleDelete(rec.id)}
                              className="w-10 h-10 p-0 rounded-xl hover:bg-white hover:text-red-600 shadow-sm border border-transparent hover:border-slate-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
