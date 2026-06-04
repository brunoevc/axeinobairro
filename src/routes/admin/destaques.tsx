import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { 
  Zap, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  XCircle,
  Star
} from "lucide-react";
import { localBoostsRepository } from "@/repositories/localBoostsRepository";
import { merchantsRepository } from "@/repositories/merchantsRepository";
import { servicesRepository } from "@/repositories/servicesRepository";
import { ridesRepository } from "@/repositories/ridesRepository";
import { LocalBoost, BoostLevel, BoostTargetType } from "@/types/boosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/destaques")({
  component: AdminDestaques,
});

function AdminDestaques() {
  const [boosts, setBoosts] = useState<LocalBoost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingBoost, setEditingBoost] = useState<Partial<LocalBoost>>({});

  // Loaded data for selection
  const merchants = useMemo(() => merchantsRepository.getAll(), []);
  const services = useMemo(() => servicesRepository.getAll(), []);
  const rides = useMemo(() => ridesRepository.list(), []);

  const refreshBoosts = () => {
    setBoosts(localBoostsRepository.getAll());
  };

  useEffect(() => {
    refreshBoosts();
  }, []);

  const handleSave = () => {
    if (!editingBoost.targetId || !editingBoost.targetType || !editingBoost.level) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const now = new Date().toISOString();
    const boost: LocalBoost = {
      id: editingBoost.id || `boost-${Date.now()}`,
      targetId: editingBoost.targetId,
      targetType: editingBoost.targetType as BoostTargetType,
      level: editingBoost.level as BoostLevel,
      startDate: editingBoost.startDate || now,
      endDate: editingBoost.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: editingBoost.isActive !== undefined ? editingBoost.isActive : true,
      createdAt: editingBoost.createdAt || now,
      updatedAt: now,
    };

    localBoostsRepository.save(boost);
    toast.success(editingBoost.id ? "Destaque atualizado" : "Destaque criado");
    setIsEditing(false);
    setEditingBoost({});
    refreshBoosts();
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir este destaque?")) {
      localBoostsRepository.delete(id);
      toast.success("Destaque removido");
      refreshBoosts();
    }
  };

  const filteredBoosts = boosts.filter(b => {
    const targetName = b.targetType === 'loja' 
      ? merchants.find(m => m.id === b.targetId)?.name 
      : b.targetType === 'servico'
      ? services.find(s => s.id === b.targetId)?.name
      : rides.find(r => r.id === b.targetId)?.name;
    
    return targetName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getTargetName = (type: string, id: string) => {
    if (type === 'loja') return merchants.find(m => m.id === id)?.name || 'N/A';
    if (type === 'servico') return services.find(s => s.id === id)?.name || 'N/A';
    if (type === 'transporte') return rides.find(r => r.id === id)?.name || 'N/A';
    return 'N/A';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Destaques</h1>
          <p className="text-slate-500 font-medium">Controle de visibilidade paga para parceiros.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingBoost({ 
              targetType: 'loja', 
              level: 'C', 
              isActive: true,
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
            setIsEditing(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl h-12 px-6 font-black gap-2 shadow-lg shadow-orange-600/20"
        >
          <Plus className="w-5 h-5" />
          Novo Destaque
        </Button>
      </div>

      {isEditing && (
        <Card className="rounded-3xl border-orange-200 bg-orange-50/30 overflow-hidden">
          <CardContent className="p-8">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-600 fill-orange-600" />
              {editingBoost.id ? "Editar Destaque" : "Configurar Novo Destaque"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Tipo de Alvo</label>
                <Select 
                  value={editingBoost.targetType} 
                  onValueChange={(val) => setEditingBoost({...editingBoost, targetType: val as BoostTargetType, targetId: ''})}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loja">Loja / Comércio</SelectItem>
                    <SelectItem value="servico">Profissional de Serviço</SelectItem>
                    <SelectItem value="transporte">Motorista / Transporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Item Alvo</label>
                <Select 
                  value={editingBoost.targetId} 
                  onValueChange={(val) => setEditingBoost({...editingBoost, targetId: val})}
                  disabled={!editingBoost.targetType}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-white">
                    <SelectValue placeholder="Selecione o item" />
                  </SelectTrigger>
                  <SelectContent>
                    {editingBoost.targetType === 'loja' && merchants.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    {editingBoost.targetType === 'servico' && services.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    {editingBoost.targetType === 'transporte' && rides.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Nível de Destaque</label>
                <Select 
                  value={editingBoost.level} 
                  onValueChange={(val) => setEditingBoost({...editingBoost, level: val as BoostLevel})}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-white">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Nível A (Premium / Topo)</SelectItem>
                    <SelectItem value="B">Nível B (Intermediário)</SelectItem>
                    <SelectItem value="C">Nível C (Básico)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Data Inicial</label>
                <Input 
                  type="date" 
                  value={editingBoost.startDate?.split('T')[0]} 
                  onChange={(e) => setEditingBoost({...editingBoost, startDate: new Date(e.target.value).toISOString()})}
                  className="h-12 rounded-xl bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Data Final</label>
                <Input 
                  type="date" 
                  value={editingBoost.endDate?.split('T')[0]} 
                  onChange={(e) => setEditingBoost({...editingBoost, endDate: new Date(e.target.value).toISOString()})}
                  className="h-12 rounded-xl bg-white"
                />
              </div>

              <div className="flex items-center gap-4 h-full pt-6">
                <Button 
                  variant={editingBoost.isActive ? "default" : "outline"}
                  onClick={() => setEditingBoost({...editingBoost, isActive: !editingBoost.isActive})}
                  className={`h-12 rounded-xl flex-1 font-bold ${editingBoost.isActive ? 'bg-green-600' : ''}`}
                >
                  {editingBoost.isActive ? "Destaque Ativo" : "Destaque Inativo"}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 border-t border-orange-100 pt-6">
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl h-12 px-6 font-bold">Cancelar</Button>
              <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl h-12 px-10 font-black uppercase text-xs tracking-widest">Salvar Destaque</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <Input 
                placeholder="Buscar por nome do parceiro..." 
                className="pl-11 h-12 rounded-2xl bg-slate-50 border-transparent focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold px-4 py-2 rounded-xl">
             {filteredBoosts.length} Destaques encontrados
           </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Alvo</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo</th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Nível</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Período</th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBoosts.map((boost) => {
                const isExpired = new Date(boost.endDate) < new Date();
                const isActive = boost.isActive && !isExpired;
                
                return (
                  <tr key={boost.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900">{getTargetName(boost.targetType, boost.targetId)}</p>
                      <p className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">ID: {boost.targetId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="capitalize text-[10px] font-bold py-1 border-slate-200">
                        {boost.targetType}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge className={`
                        font-black rounded-lg w-8 h-8 p-0 flex items-center justify-center
                        ${boost.level === 'A' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 
                          boost.level === 'B' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}
                      `}>
                        {boost.level}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(boost.startDate).toLocaleDateString()} - {new Date(boost.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       {isActive ? (
                         <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <CheckCircle className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Ativo</span>
                         </div>
                       ) : (
                         <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                            <XCircle className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{isExpired ? 'Expirado' : 'Inativo'}</span>
                         </div>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setEditingBoost(boost);
                            setIsEditing(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-8 h-8 rounded-lg hover:bg-white hover:text-orange-600 transition-all border border-transparent hover:border-slate-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(boost.id)}
                          className="w-8 h-8 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredBoosts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 grayscale opacity-40">
                      <Zap className="w-12 h-12 text-slate-300" />
                      <div>
                        <p className="font-black text-slate-400 text-lg">Nenhum destaque configurado</p>
                        <p className="text-slate-400 text-sm">Clique em "Novo Destaque" para começar.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
