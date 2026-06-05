import React, { useState } from "react";
import { Appointment, AppointmentStatus } from "@/types/appointments";
import { appointmentsRepository } from "@/repositories/appointmentsRepository";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, User, Phone, CheckCircle2, XCircle, Clock4, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgendaManagerProps {
  merchantId: string;
}

export function AgendaManager({ merchantId }: AgendaManagerProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsRepository.getByMerchant(merchantId));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    serviceName: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
  });

  const refreshData = () => {
    setAppointments(appointmentsRepository.getByMerchant(merchantId));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      merchantId,
      ...formData,
      serviceId: "manual",
      status: "solicitado",
      createdAt: new Date().toISOString(),
    };
    appointmentsRepository.save(newAppointment);
    setIsModalOpen(false);
    refreshData();
    setFormData({
      customerName: "",
      customerPhone: "",
      serviceName: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00",
    });
  };

  const updateStatus = (id: string, status: AppointmentStatus) => {
    appointmentsRepository.updateStatus(id, status);
    refreshData();
  };

  const deleteAppointment = (id: string) => {
    if (confirm("Deseja excluir este agendamento?")) {
      appointmentsRepository.delete(id);
      refreshData();
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "solicitado": return "bg-orange-100 text-orange-700 border-orange-200";
      case "confirmado": return "bg-blue-100 text-blue-700 border-blue-200";
      case "concluido": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cancelado": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const sortedAppointments = [...appointments].sort((a, b) => 
    `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Agenda</h2>
          <p className="text-slate-500 font-medium text-sm">Gerencie seus horários e atendimentos.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl font-bold gap-2">
              <Plus className="w-4 h-4" /> Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">Novo Agendamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Cliente</label>
                <Input required placeholder="Nome do cliente" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Telefone</label>
                <Input required placeholder="Ex: 22 99999-9999" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Serviço</label>
                <Input required placeholder="Ex: Corte de Cabelo" value={formData.serviceName} onChange={e => setFormData({...formData, serviceName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Data</label>
                  <Input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Hora</label>
                  <Input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl font-black h-12">Salvar na Agenda</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sortedAppointments.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="font-bold text-slate-500">Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          sortedAppointments.map((app) => (
            <Card key={app.id} className="p-5 rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-slate-900 leading-none">{app.customerName}</h4>
                      <Badge variant="outline" className={`text-[10px] font-black uppercase py-0 ${getStatusColor(app.status)}`}>
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold text-blue-600 mb-1">{app.serviceName}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(app.date).toLocaleDateString('pt-BR')}</span>
                      <span className="flex items-center gap-1"><Clock4 className="w-3 h-3" /> {app.startTime}h</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {app.customerPhone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 md:self-center">
                  {app.status === 'solicitado' && (
                    <Button size="sm" onClick={() => updateStatus(app.id, 'confirmado')} className="bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Confirmar
                    </Button>
                  )}
                  {app.status === 'confirmado' && (
                    <Button size="sm" onClick={() => updateStatus(app.id, 'concluido')} className="bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-bold gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Concluir
                    </Button>
                  )}
                  {['solicitado', 'confirmado'].includes(app.status) && (
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(app.id, 'cancelado')} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold gap-1">
                      <XCircle className="w-3 h-3" /> Cancelar
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => deleteAppointment(app.id)} className="text-slate-300 hover:text-rose-600 rounded-lg h-8 w-8">
                    <Trash2 className="w-4 h-4" />
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
