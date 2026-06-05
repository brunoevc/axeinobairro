import React, { useState } from "react";
import { Customer, CRMStatus, Origin } from "@/types/crm";
import { crmRepository } from "@/repositories/crmRepository";
import { Button } from "@/components/ui/button";
import { Plus, Users, Search, Phone, MapPin, Tag, Briefcase, TrendingUp, MoreVertical, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CRMManagerProps {
  merchantId: string;
}

export function CRMManager({ merchantId }: CRMManagerProps) {
  const [customers, setCustomers] = useState<Customer[]>(crmRepository.getByMerchant(merchantId));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bairro: "",
    service: "",
    origin: "axei" as Origin,
    status: "novo" as CRMStatus,
  });

  const refreshData = () => {
    setCustomers(crmRepository.getByMerchant(merchantId));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      merchantId,
      ...formData,
      createdAt: new Date().toISOString(),
    };
    crmRepository.save(newCustomer);
    setIsModalOpen(false);
    refreshData();
    setFormData({
      name: "",
      phone: "",
      bairro: "",
      service: "",
      origin: "axei",
      status: "novo",
    });
  };

  const updateStatus = (id: string, status: CRMStatus) => {
    crmRepository.updateStatus(id, status);
    refreshData();
  };

  const deleteCustomer = (id: string) => {
    if (confirm("Deseja excluir este cliente?")) {
      crmRepository.delete(id);
      refreshData();
    }
  };

  const getStatusLabel = (status: CRMStatus) => {
    switch (status) {
      case "novo": return "Novo";
      case "contato_realizado": return "Contato Realizado";
      case "orcamento_enviado": return "Orçamento Enviado";
      case "agendado": return "Agendado";
      case "concluido": return "Concluído";
      case "cliente_recorrente": return "Recorrente";
    }
  };

  const getStatusColor = (status: CRMStatus) => {
    switch (status) {
      case "novo": return "bg-blue-100 text-blue-700 border-blue-200";
      case "contato_realizado": return "bg-orange-100 text-orange-700 border-orange-200";
      case "orcamento_enviado": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "agendado": return "bg-purple-100 text-purple-700 border-purple-200";
      case "concluido": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cliente_recorrente": return "bg-pink-100 text-pink-700 border-pink-200";
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Gestão de Clientes (CRM)</h2>
          <p className="text-slate-500 font-medium text-sm">Organize seus contatos e pipeline de vendas.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar cliente..." 
              className="pl-10 w-full md:w-64 rounded-xl border-slate-200" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 hover:bg-slate-800 rounded-xl font-bold gap-2">
                <Plus className="w-4 h-4" /> Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-black">Adicionar ao CRM</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Nome</label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400">Telefone</label>
                    <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400">Bairro</label>
                    <Input required value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Serviço de Interesse</label>
                  <Input required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400">Origem</label>
                    <Select value={formData.origin} onValueChange={(v: Origin) => setFormData({...formData, origin: v})}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="axei">Axêi</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="indicacao">Indicação</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400">Status Inicial</label>
                    <Select value={formData.status} onValueChange={(v: CRMStatus) => setFormData({...formData, status: v})}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="novo">Novo</SelectItem>
                        <SelectItem value="contato_realizado">Contato Realizado</SelectItem>
                        <SelectItem value="orcamento_enviado">Orçamento Enviado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl font-black h-12 mt-4">Salvar Cliente</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="font-bold text-slate-500">Nenhum cliente cadastrado.</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id} className="p-6 rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shrink-0 font-black text-xl">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-black text-slate-900 text-lg">{customer.name}</h4>
                      <Badge className={`text-[10px] font-black uppercase py-0 ${getStatusColor(customer.status)}`}>
                        {getStatusLabel(customer.status)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" /> {customer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" /> {customer.bairro}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
                        <Briefcase className="w-4 h-4 text-slate-400" /> {customer.service}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-tight">
                        <Tag className="w-4 h-4 text-slate-400" /> {customer.origin}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:self-start">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="rounded-xl font-bold gap-2">Mudar Status <TrendingUp className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="rounded-xl w-48">
                      <DropdownMenuItem onClick={() => updateStatus(customer.id, 'contato_realizado')}>Contato Realizado</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(customer.id, 'orcamento_enviado')}>Orçamento Enviado</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(customer.id, 'agendado')}>Agendado</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(customer.id, 'concluido')}>Concluído</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(customer.id, 'cliente_recorrente')}>Recorrente</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="icon" variant="ghost" onClick={() => deleteCustomer(customer.id)} className="text-slate-300 hover:text-rose-600 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
