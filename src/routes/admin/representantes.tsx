import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { representativesRepository } from "@/repositories/representativesRepository";
import { Representative } from "@/types/representatives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Check, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/representantes")({
  component: AdminRepresentantes,
});

function AdminRepresentantes() {
  const [reps, setReps] = useState<Representative[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Representative>>({
    name: "",
    role: "",
    city: "Araruama",
    neighborhood: "",
    phone: "",
    whatsapp: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    setReps(representativesRepository.getAll());
  }, []);

  const handleSave = () => {
    if (!formData.name || !formData.role) {
      toast.error("Nome e Cargo são obrigatórios");
      return;
    }

    let updatedReps;
    if (editingId) {
      updatedReps = reps.map(r => r.id === editingId ? { 
        ...r, 
        ...formData, 
        updatedAt: new Date().toISOString() 
      } as Representative : r);
      toast.success("Representante atualizado");
    } else {
      const newRep: Representative = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Representative;
      updatedReps = [...reps, newRep];
      toast.success("Representante criado");
    }

    representativesRepository.saveAll(updatedReps);
    setReps(updatedReps);
    setIsAdding(false);
    setEditingId(null);
    setFormData({ city: "Araruama", isActive: true });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir?")) {
      const updated = reps.filter(r => r.id !== id);
      representativesRepository.saveAll(updated);
      setReps(updated);
      toast.success("Removido com sucesso");
    }
  };

  const startEdit = (rep: Representative) => {
    setFormData(rep);
    setEditingId(rep.id);
    setIsAdding(true);
  };

  return (
    <div className="p-8 pb-32 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/admin" className="text-sm text-slate-500 hover:text-orange-600 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
          </Link>
          <h1 className="text-3xl font-black text-slate-900">Gestão de Representantes</h1>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-orange-600 hover:bg-orange-700 rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Novo Representante
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="mb-12 border-2 border-orange-100 rounded-3xl overflow-hidden shadow-xl">
          <CardHeader className="bg-orange-50/50 border-b border-orange-100">
            <CardTitle className="text-orange-900">{editingId ? "Editar Representante" : "Novo Representante"}</CardTitle>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Cargo / Papel</Label>
              <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Ex: Líder Comunitário" />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="22 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp (Somente números)</Label>
              <Input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} placeholder="5522999999999" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Descrição / Bio</Label>
              <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); }} className="rounded-xl">Cancelar</Button>
              <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 rounded-xl px-8">Salvar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {reps.map(rep => (
          <div key={rep.id} className="bg-white border border-slate-100 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black">
                {rep.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{rep.name}</h3>
                <p className="text-sm text-slate-500">{rep.role} • {rep.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={() => startEdit(rep)} className="text-slate-400 hover:text-blue-600">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(rep.id)} className="text-slate-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}