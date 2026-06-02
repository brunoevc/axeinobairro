import { useState, useEffect } from "react";
import { getNews, saveNews } from "@/lib/news";
import { merchants } from "@/data/merchants";
import { NewsItem } from "@/types/news";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Eye, MousePointer2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminNoticias() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<NewsItem> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setNews(getNews());
  }, []);

  const isSponsorEligible = (m: any) =>
    ["verificado", "parceiro", "verified", "partner"].includes(m.status);

  const eligibleMerchants = merchants.filter(isSponsorEligible);

  const handleSave = () => {
    if (!editingItem?.title || !editingItem?.merchantId) {
      toast.error("Preencha título e loja patrocinadora");
      return;
    }

    let updated: NewsItem[];
    if (editingItem.id) {
      updated = news.map((n) =>
        n.id === editingItem.id ? (editingItem as NewsItem) : n
      );
      toast.success("Notícia atualizada");
    } else {
      const newItem: NewsItem = {
        ...(editingItem as NewsItem),
        id: Date.now().toString(),
        date: new Date().toISOString(),
        views: 0,
        clicks: 0,
        isActive: editingItem.isActive ?? true,
        category: editingItem.category || "utilidade",
        exposureLevel: editingItem.exposureLevel || "C",
        imageUrl: editingItem.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
      };
      updated = [...news, newItem];
      toast.success("Notícia criada");
    }

    setNews(updated);
    saveNews(updated);
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta notícia?")) {
      const updated = news.filter((n) => n.id !== id);
      setNews(updated);
      saveNews(updated);
      toast.success("Notícia excluída");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gerenciar Notícias</h1>
          <p className="text-slate-500 text-sm">Controle de notícias patrocinadas e métricas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setEditingItem({ 
                title: "", 
                summary: "", 
                content: "", 
                merchantId: "", 
                exposureLevel: "C", 
                isActive: true,
                category: "utilidade"
              })}
              className="bg-orange-600 hover:bg-orange-700 font-bold rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Notícia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">
                {editingItem?.id ? "Editar Notícia" : "Criar Nova Notícia"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="font-bold">Título</Label>
                <Input 
                  id="title" 
                  value={editingItem?.title || ""} 
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  placeholder="Título da notícia..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="summary" className="font-bold">Resumo (Feed)</Label>
                <Textarea 
                  id="summary" 
                  value={editingItem?.summary || ""} 
                  onChange={(e) => setEditingItem({...editingItem, summary: e.target.value})}
                  placeholder="Breve descrição que aparece no card..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="font-bold">Loja Patrocinadora</Label>
                  <Select 
                    value={editingItem?.merchantId} 
                    onValueChange={(val) => setEditingItem({...editingItem, merchantId: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma loja" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleMerchants.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Nível de Destaque</Label>
                  <Select 
                    value={editingItem?.exposureLevel} 
                    onValueChange={(val: any) => setEditingItem({...editingItem, exposureLevel: val})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Nível A (Banner Principal)</SelectItem>
                      <SelectItem value="B">Nível B (Destaque Feed)</SelectItem>
                      <SelectItem value="C">Nível C (Normal)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="font-bold">Categoria</Label>
                  <Select 
                    value={editingItem?.category} 
                    onValueChange={(val: any) => setEditingItem({...editingItem, category: val})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eventos">Eventos</SelectItem>
                      <SelectItem value="promocoes">Promoções</SelectItem>
                      <SelectItem value="utilidade">Utilidade Pública</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image" className="font-bold">URL da Imagem</Label>
                  <Input 
                    id="image" 
                    value={editingItem?.imageUrl || ""} 
                    onChange={(e) => setEditingItem({...editingItem, imageUrl: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch 
                  id="active" 
                  checked={editingItem?.isActive} 
                  onCheckedChange={(val) => setEditingItem({...editingItem, isActive: val})}
                />
                <Label htmlFor="active" className="font-bold">Notícia Ativa</Label>
              </div>

              <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 font-bold h-12">
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Notícia</TableHead>
              <TableHead className="font-bold">Nível</TableHead>
              <TableHead className="font-bold">Métricas</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                  Nenhuma notícia cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-xs">
                    <div className="font-bold truncate">{item.title}</div>
                    <div className="text-xs text-slate-500 truncate">{item.summary}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                      item.exposureLevel === 'A' ? 'bg-orange-100 text-orange-700' :
                      item.exposureLevel === 'B' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      Nível {item.exposureLevel}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-slate-500"><Eye className="w-3 h-3" /> {item.views}</span>
                      <span className="flex items-center gap-1 text-slate-500"><MousePointer2 className="w-3 h-3" /> {item.clicks}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`w-2 h-2 rounded-full inline-block mr-2 ${item.isActive ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <span className="text-xs font-bold">{item.isActive ? 'Ativa' : 'Inativa'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setEditingItem(item);
                          setIsDialogOpen(true);
                        }}
                        className="h-8 w-8 text-slate-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}