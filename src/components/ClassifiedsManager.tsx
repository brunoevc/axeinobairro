import { useState, useMemo } from "react";
import { 
  Plus, 
  Tag, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  X,
  MessageCircle,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassifiedAd, ClassifiedCategory } from "@/types/classifieds";
import { classifiedsRepository } from "@/repositories/classifiedsRepository";
import { neighborhoods } from "@/data/merchants";
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

interface ClassifiedsManagerProps {
  userId: string;
  userName: string;
  planType: 'free' | 'community';
}

export function ClassifiedsManager({ userId, userName, planType }: ClassifiedsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState(() => classifiedsRepository.getByUser(userId));

  // Limits
  const MAX_ADS = planType === 'community' ? 20 : 3;
  const MAX_PHOTOS = planType === 'community' ? 5 : 1;
  const VALIDITY_DAYS = planType === 'community' ? 60 : 15;

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    price: string;
    category: ClassifiedCategory;
    neighborhood: string;
    whatsapp: string;
    images: string[];
  }>({
    title: "",
    description: "",
    price: "",
    category: "diversos",
    neighborhood: neighborhoods[0],
    whatsapp: "",
    images: []
  });

  const refreshAds = () => {
    setAds(classifiedsRepository.getByUser(userId));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (formData.images.length + files.length > MAX_PHOTOS) {
      toast.error(`Limite de ${MAX_PHOTOS} fotos atingido para o plano ${planType === 'community' ? 'Comunidade' : 'Gratuito'}.`);
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (ads.length >= MAX_ADS) {
      toast.error(`Você atingiu o limite de ${MAX_ADS} anúncios ativos.`);
      return;
    }

    setLoading(true);
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + VALIDITY_DAYS);

    const newAd: ClassifiedAd = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      userName,
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      neighborhood: formData.neighborhood,
      whatsapp: formData.whatsapp,
      images: formData.images,
      status: 'active',
      planType,
      views: 0,
      reports: 0,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    try {
      classifiedsRepository.save(newAd);
      toast.success("Anúncio publicado com sucesso!");
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "diversos",
        neighborhood: neighborhoods[0],
        whatsapp: "",
        images: []
      });
      refreshAds();
    } catch (err) {
      toast.error("Erro ao salvar anúncio.");
    } finally {
      setLoading(false);
    }
  };

  const markAsSold = (id: string) => {
    const ad = ads.find(a => a.id === id);
    if (ad) {
      classifiedsRepository.save({ ...ad, status: 'sold' });
      toast.success("Anúncio marcado como vendido.");
      refreshAds();
    }
  };

  const deleteAd = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este anúncio?")) {
      classifiedsRepository.delete(id);
      toast.success("Anúncio removido.");
      refreshAds();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Meus Anúncios</h2>
          <p className="text-sm font-medium text-slate-500">
            Você possui <span className="text-slate-900 font-bold">{ads.length}/{MAX_ADS}</span> anúncios ativos.
          </p>
        </div>
        {!showForm && (
          <Button 
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-orange-600 hover:bg-orange-700 font-black h-12 px-6"
            disabled={ads.length >= MAX_ADS}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Anúncio
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="rounded-[2.5rem] border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-top duration-500">
          <div className="p-8 md:p-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Criar Novo Anúncio</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="rounded-xl">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Título</label>
                  <Input 
                    required
                    placeholder="Ex: Bicicleta Aro 29 seminova"
                    className="h-12 rounded-xl"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Preço (R$)</label>
                  <Input 
                    type="number"
                    required
                    placeholder="0.00"
                    className="h-12 rounded-xl"
                    value={formData.price}
                    onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  />
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Coloque 0 para "Grátis"</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Categoria</label>
                    <Select 
                      value={formData.category} 
                      onValueChange={v => setFormData(prev => ({ ...prev, category: v as ClassifiedCategory }))}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Bairro</label>
                    <Select 
                      value={formData.neighborhood} 
                      onValueChange={v => setFormData(prev => ({ ...prev, neighborhood: v }))}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {neighborhoods.map(n => (
                          <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">WhatsApp de Contato</label>
                  <Input 
                    required
                    placeholder="Ex: 21999999999"
                    className="h-12 rounded-xl"
                    value={formData.whatsapp}
                    onChange={e => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Descrição Detalhada</label>
                  <Textarea 
                    required
                    placeholder="Conte mais sobre o que você está vendendo..."
                    className="min-h-[120px] rounded-2xl p-4"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Fotos ({formData.images.length}/{MAX_PHOTOS})
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((img, i) => (
                      <div key={i} className="aspect-square relative rounded-xl overflow-hidden border border-slate-200">
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-lg p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {formData.images.length < MAX_PHOTOS && (
                      <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <ImageIcon className="w-6 h-6 text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase mt-2">Adicionar</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">
                    Plano {planType === 'community' ? 'Comunidade' : 'Gratuito'}: limite de {MAX_PHOTOS} fotos.
                  </p>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black shadow-lg shadow-orange-200"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "PUBLICAR ANÚNCIO"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* Ads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.length === 0 ? (
          <div className="md:col-span-3 py-12 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Você ainda não tem anúncios cadastrados.</p>
          </div>
        ) : (
          ads.map(ad => (
            <Card key={ad.id} className="rounded-[2rem] overflow-hidden border-slate-100 shadow-sm hover:shadow-lg transition-all">
              <div className="aspect-video relative bg-slate-100">
                {ad.images[0] ? (
                  <img src={ad.images[0]} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Tag className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={`uppercase text-[10px] font-black ${
                    ad.status === 'active' ? 'bg-emerald-500' : 
                    ad.status === 'sold' ? 'bg-blue-500' : 'bg-slate-500'
                  } text-white border-none shadow-sm`}>
                    {ad.status === 'active' ? 'Ativo' : ad.status === 'sold' ? 'Vendido' : 'Expirado'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h4 className="font-black text-slate-900 mb-1 line-clamp-1">{ad.title}</h4>
                <div className="text-lg font-black text-orange-600 mb-4">
                  {ad.price === 0 ? "Grátis" : formatCurrency(ad.price)}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase">
                    <ImageIcon className="w-3 h-3" />
                    {ad.images.length} fotos
                  </div>
                  <div className="flex gap-2">
                    {ad.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 px-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-[10px] uppercase"
                        onClick={() => markAsSold(ad.id)}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Vendido
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold text-[10px] uppercase"
                      onClick={() => deleteAd(ad.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Remover
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-100 rounded-[2rem] p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-blue-500 shrink-0" />
          <div>
            <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Regras dos Classificados</h4>
            <ul className="mt-2 space-y-1">
              <li className="text-xs text-blue-700 font-medium">• Validade do anúncio: <span className="font-black">{VALIDITY_DAYS} dias</span></li>
              <li className="text-xs text-blue-700 font-medium">• Limite de fotos: <span className="font-black">{MAX_PHOTOS}</span></li>
              <li className="text-xs text-blue-700 font-medium">• O Axêi no Bairro não intermedia pagamentos.</li>
              <li className="text-xs text-blue-700 font-medium">• Sempre encontre o comprador em locais públicos.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
