import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/admin/transporte")({
  component: AdminTransporte,
});
import { ridesRepository } from "@/repositories/ridesRepository";
import { RideDriver, ServiceType, AvailabilityStatus, RideRoute } from "@/types/rides";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Pencil, Trash2, Plus, Phone, Car, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function AdminTransporte() {
  const [rides, setRides] = useState<RideDriver[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<RideDriver> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setRides(ridesRepository.list());
  }, []);

  const handleSave = () => {
    if (!editingItem?.name || !editingItem?.phone || !editingItem?.bairro || !editingItem?.serviceType) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingItem.phone.replace(/\D/g, '').length < 10) {
      toast.error("Telefone inválido");
      return;
    }

    if (!editingItem.routes || editingItem.routes.length === 0) {
      toast.error("Adicione pelo menos uma rota");
      return;
    }

    if (editingItem.id) {
      ridesRepository.update(editingItem.id, editingItem);
      toast.success("Motorista atualizado");
    } else {
      const newItem: RideDriver = {
        ...(editingItem as RideDriver),
        id: Date.now().toString(),
      };
      ridesRepository.create(newItem);
      toast.success("Motorista cadastrado");
    }

    setRides(ridesRepository.list());
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Excluir este motorista?")) {
      ridesRepository.delete(id);
      setRides(ridesRepository.list());
      toast.success("Excluído com sucesso");
    }
  };

  const addRoute = () => {
    const currentRoutes = editingItem?.routes || [];
    setEditingItem({
      ...editingItem,
      routes: [...currentRoutes, { origin: "", destination: "" }]
    });
  };

  const updateRoute = (index: number, field: keyof RideRoute, value: string) => {
    const routes = [...(editingItem?.routes || [])];
    routes[index] = { ...routes[index], [field]: value };
    setEditingItem({ ...editingItem, routes });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gerenciar Transporte</h1>
          <p className="text-slate-500 text-sm">Controle de motoristas e frotas locais</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setEditingItem({ 
                name: "", 
                phone: "", 
                vehicle: "", 
                bairro: "", 
                serviceType: "carona", 
                availabilityStatus: "online",
                routes: []
              })}
              className="bg-orange-600 hover:bg-orange-700 font-bold rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Motorista
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">
                {editingItem?.id ? "Editar Motorista" : "Cadastrar Motorista"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="11 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="font-bold">Veículo</Label>
                  <Input 
                    value={editingItem?.vehicle || ""} 
                    onChange={(e) => setEditingItem({...editingItem, vehicle: e.target.value})}
                    placeholder="Marca/Modelo/Cor"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Bairro Base</Label>
                  <Input 
                    value={editingItem?.bairro || ""} 
                    onChange={(e) => setEditingItem({...editingItem, bairro: e.target.value})}
                    placeholder="Ex: Centro"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="font-bold">Tipo de Serviço</Label>
                  <Select 
                    value={editingItem?.serviceType} 
                    onValueChange={(val: ServiceType) => setEditingItem({...editingItem, serviceType: val})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carona">Carona</SelectItem>
                      <SelectItem value="carro">Carro</SelectItem>
                      <SelectItem value="frete">Frete</SelectItem>
                      <SelectItem value="moto">Moto</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Disponibilidade</Label>
                  <Select 
                    value={editingItem?.availabilityStatus} 
                    onValueChange={(val: AvailabilityStatus) => setEditingItem({...editingItem, availabilityStatus: val})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online Agora</SelectItem>
                      <SelectItem value="disponivel_hoje">Disponível Hoje</SelectItem>
                      <SelectItem value="indisponivel">Indisponível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="font-bold">Zona no Mapa Visual</Label>
                  <Select 
                    value={editingItem?.mapZone} 
                    onValueChange={(val: string) => setEditingItem({...editingItem, mapZone: val})}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione a zona" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Centro">Centro</SelectItem>
                      <SelectItem value="Vila Madalena">Vila Madalena</SelectItem>
                      <SelectItem value="Mooca">Mooca</SelectItem>
                      <SelectItem value="Jardins">Jardins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold">Nota de Localização</Label>
                  <Input 
                    value={editingItem?.locationNote || ""} 
                    onChange={(e) => setEditingItem({...editingItem, locationNote: e.target.value})}
                    placeholder="Ex: Perto do Posto Ipiranga"
                  />
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <Label className="font-bold text-orange-600">Rotas Principais</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addRoute} className="h-8 rounded-lg">
                    <Plus className="w-3 h-3 mr-1" /> Add Rota
                  </Button>
                </div>
                {editingItem?.routes?.map((route, index) => (
                  <div key={index} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl">
                    <Input 
                      placeholder="Origem" 
                      value={route.origin} 
                      onChange={(e) => updateRoute(index, 'origin', e.target.value)}
                      className="h-9"
                    />
                    <span className="text-slate-400">→</span>
                    <Input 
                      placeholder="Destino" 
                      value={route.destination} 
                      onChange={(e) => updateRoute(index, 'destination', e.target.value)}
                      className="h-9"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        const routes = [...(editingItem.routes || [])];
                        routes.splice(index, 1);
                        setEditingItem({ ...editingItem, routes });
                      }}
                      className="text-red-500 h-9 w-9"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 font-bold h-12">
                Salvar Cadastro
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Motorista</TableHead>
              <TableHead className="font-bold">Serviço</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rides.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-slate-400">Nenhum motorista cadastrado.</TableCell></TableRow>
            ) : (
              rides.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-bold">{item.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1"><Car className="w-3 h-3" /> {item.vehicle}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-black uppercase">{item.serviceType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.availabilityStatus === 'online' ? 'bg-green-500' : item.availabilityStatus === 'disponivel_hoje' ? 'bg-orange-500' : 'bg-slate-300'}`} />
                      <span className="text-xs font-bold">{item.availabilityStatus}</span>
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
  );
}
