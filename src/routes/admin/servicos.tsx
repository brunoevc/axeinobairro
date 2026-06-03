import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/admin/servicos")({
  component: AdminServicos,
});
import { servicesRepository } from "@/repositories/servicesRepository";
import { ServiceProvider, ServiceCategory } from "@/types/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Plus, Phone, Briefcase, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { neighborhoods } from "@/data/merchants";

const categories: ServiceCategory[] = [
  'eletricista', 'encanador', 'pedreiro', 'pintor', 'diarista', 'jardineiro',
  'montador de móveis', 'técnico de informática', 'técnico de celular',
  'chaveiro', 'costureira', 'professor particular', 'cuidador de idosos', 'passeador de cães'
];

export default function AdminServicos() {
  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<ServiceProvider> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setServices(servicesRepository.getAll());
  }, []);

  const handleSave = () => {
    const error = servicesRepository.validate(editingItem || {});
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const itemToSave: ServiceProvider = {
        id: editingItem?.id || Date.now().toString(),
        name: editingItem?.name || "",
        category: editingItem?.category as ServiceCategory,
        phone: editingItem?.phone || "",
        neighborhood: editingItem?.neighborhood || "Centro",
        description: editingItem?.description || "",
        isAvailable: editingItem?.isAvailable ?? true,
        verified: editingItem?.verified || false,
        priceNote: editingItem?.priceNote || "",
        serviceArea: editingItem?.serviceArea || [],
        rating: editingItem?.rating || 5.0,
        createdAt: editingItem?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      servicesRepository.save(itemToSave);
      setServices(servicesRepository.getAll());
      setIsDialogOpen(false);
      setEditingItem(null);
      toast.success(editingItem?.id ? "Profissional atualizado" : "Profissional cadastrado");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Excluir este profissional?")) {
      servicesRepository.delete(id);
      setServices(servicesRepository.getAll());
      toast.success("Excluído com sucesso");
    }
  };

  const toggleServiceArea = (hood: string) => {
    const currentAreas = editingItem?.serviceArea || [];
    const newAreas = currentAreas.includes(hood)
      ? currentAreas.filter(a => a !== hood)
      : [...currentAreas, hood];
    setEditingItem({ ...editingItem, serviceArea: newAreas });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gerenciar Serviços</h1>
          <p className="text-slate-500 text-sm">Controle de profissionais e prestadores locais</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setEditingItem({ 
                name: "", 
                phone: "", 
                neighborhood: "Centro", 
                category: "eletricista", 
                isAvailable: true,
                verified: false,
                priceNote: "",
                serviceArea: [],
                description: ""
              })}
              className="bg-orange-600 hover:bg-orange-700 font-bold rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Profissional
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">
                {editingItem?.id ? "Editar Profissional" : "Cadastrar Profissional"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="font-bold">Nome</Label>
                  <Input 
                    value={editingItem?.name || ""} 
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Telefone (WhatsApp)</Label>
                  <Input 
                    value={editingItem?.phone || ""} 
                    onChange={(e) => setEditingItem({...editingItem, phone: e.target.value})}
                    placeholder="21 99999-9999"
                  />
                  <p className="text-[10px] text-slate-400">O sistema formatará com 55 automaticamente.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="font-bold">Categoria</Label>
                  <Select 
                    value={editingItem?.category} 
                    onValueChange={(val: ServiceCategory) => setEditingItem({...editingItem, category: val})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Bairro Base</Label>
                  <Select 
                    value={editingItem?.neighborhood} 
                    onValueChange={(val) => setEditingItem({...editingItem, neighborhood: val})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {neighborhoods.map(hood => (
                        <SelectItem key={hood} value={hood}>{hood}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="font-bold">Observação de Preço (Opcional)</Label>
                <Input 
                  value={editingItem?.priceNote || ""} 
                  onChange={(e) => setEditingItem({...editingItem, priceNote: e.target.value})}
                  placeholder="Ex: A partir de R$ 100,00 ou Orçamento gratuito"
                />
              </div>

              <div className="grid gap-2">
                <Label className="font-bold">Áreas Adicionais de Atendimento</Label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {neighborhoods.map(hood => (
                    <Badge 
                      key={hood}
                      variant={editingItem?.serviceArea?.includes(hood) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleServiceArea(hood)}
                    >
                      {hood}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="font-bold">Descrição do Serviço</Label>
                <Textarea 
                  value={editingItem?.description || ""} 
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  placeholder="Descreva o que você faz..."
                  className="h-24"
                />
              </div>

              <div className="flex flex-col gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="isAvailable"
                    checked={editingItem?.isAvailable ?? true}
                    onCheckedChange={(checked) => setEditingItem({...editingItem, isAvailable: !!checked})}
                  />
                  <Label htmlFor="isAvailable" className="font-bold cursor-pointer">Disponível para novos trabalhos</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="verified"
                    checked={editingItem?.verified || false}
                    onCheckedChange={(checked) => setEditingItem({...editingItem, verified: !!checked})}
                  />
                  <Label htmlFor="verified" className="font-bold cursor-pointer flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Profissional Verificado (Selo de confiança)
                  </Label>
                </div>
              </div>

              <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 font-black h-12 shadow-lg shadow-orange-600/20">
                Salvar Cadastro
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {services.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-bold">Nenhum profissional cadastrado.</div>
          ) : (
            services.map((item) => (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">{item.name}</span>
                      {item.verified && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="text-xs text-slate-500 font-bold">{item.category}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setIsDialogOpen(true); }} className="h-8 w-8 text-slate-600"><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-red-600"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 text-[11px] font-bold text-slate-500 gap-2">
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-600" /> {item.neighborhood}</div>
                  <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-orange-600" /> {item.phone}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <span className="text-[10px] font-black uppercase text-slate-400">{item.isAvailable ? "Disponível" : "Indisponível"}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold">Profissional</TableHead>
                <TableHead className="font-bold">Categoria</TableHead>
                <TableHead className="font-bold">Bairro</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-400 font-bold">Nenhum profissional cadastrado.</TableCell></TableRow>
              ) : (
                services.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{item.name}</span>
                        {item.verified && <CheckCircle2 className="w-4 h-4 text-blue-600" title="Verificado" />}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 font-medium"><Phone className="w-3 h-3" /> {item.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-black uppercase">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-bold text-slate-700">{item.neighborhood}</div>
                      {item.serviceArea && item.serviceArea.length > 0 && (
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">Atende: {item.serviceArea.join(', ')}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`} />
                        <span className="text-xs font-bold">{item.isAvailable ? "Disponível" : "Indisponível"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setIsDialogOpen(true); }} className="h-8 w-8 text-slate-600"><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}