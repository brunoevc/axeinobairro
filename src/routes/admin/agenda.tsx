import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getAppointments, updateAppointmentStatus, saveAppointments } from "@/lib/scheduling";
import { merchants } from "@/data/merchants";
import { Appointment } from "@/types/scheduling";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, Trash2, Info, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminAgenda() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setAppointments(getAppointments());
  }, []);

  const handleStatusChange = (id: string, status: Appointment["status"]) => {
    updateAppointmentStatus(id, status);
    setAppointments(getAppointments());
    toast.success(`Agendamento ${status === 'confirmed' ? 'confirmado' : 'cancelado'}`);
  };

  const handleReschedule = (app: Appointment) => {
    // 1. Cancela o atual
    handleStatusChange(app.id, 'cancelled');
    
    // 2. Redireciona com query params
    navigate({ 
      to: "/negocios/$id/agendar", 
      params: { id: app.merchantId },
      search: {
        name: app.customerName,
        phone: app.customerPhone
      }
    });
    
    toast.info("Redirecionando para novo agendamento...");
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir este registro?")) {
      const updated = appointments.filter(app => app.id !== id);
      saveAppointments(updated);
      setAppointments(updated);
      toast.success("Registro removido");
    }
  };

  const getMerchantName = (id: string) => merchants.find(m => m.id === id)?.name || "Loja";

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-32">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Agenda Geral</h1>
            <p className="text-slate-500 font-bold">Gestão de agendamentos e horários</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-center gap-2">
            <Info className="w-4 h-4 text-orange-600" />
            <span className="text-xs text-orange-800 font-bold">Modo de Simulação Ativo</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-3xl border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">
                {appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-orange-600">
                {appointments.filter(a => a.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Cancelados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-red-500">
                {appointments.filter(a => a.status === 'cancelled').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Data/Hora</TableHead>
                <TableHead className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Profissional/Loja</TableHead>
                <TableHead className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Cliente</TableHead>
                <TableHead className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Status</TableHead>
                <TableHead className="text-right font-black text-slate-900 uppercase text-[10px] tracking-widest">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Calendar className="w-12 h-12 opacity-20" />
                      <p className="font-bold">Nenhum agendamento encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                [...appointments].reverse().map((app) => (
                  <TableRow key={app.id} className="group hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-orange-500" />
                          {new Date(app.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          {app.startTime}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-700">{getMerchantName(app.merchantId)}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{app.serviceName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {app.customerName}
                        </span>
                        <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-1">
                          <Phone className="w-3.5 h-3.5" />
                          {app.customerPhone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        app.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        app.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {app.status === 'pending' ? 'Pendente' : 
                         app.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {app.status === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleStatusChange(app.id, 'confirmed')}
                            className="h-8 w-8 text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {app.status !== 'cancelled' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleReschedule(app)}
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                            title="Reagendar"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                        {app.status !== 'cancelled' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleStatusChange(app.id, 'cancelled')}
                            className="h-8 w-8 text-orange-600 hover:bg-orange-50"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(app.id)}
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
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
    </div>
  );
}
