import { Appointment } from "@/types/appointments";
import { Customer } from "@/types/crm";
import { Card } from "@/components/ui/card";
import { Users, Calendar, CheckCircle2, TrendingUp } from "lucide-react";

interface ProfessionalDashboardMetricsProps {
  appointments: Appointment[];
  customers: Customer[];
}

export function ProfessionalDashboardMetrics({ appointments, customers }: ProfessionalDashboardMetricsProps) {
  const activeCustomers = customers.filter(c => c.status !== 'concluido').length;
  const completedAppointments = appointments.filter(a => a.status === 'concluido').length;
  const pendingAppointments = appointments.filter(a => ['solicitado', 'confirmado'].includes(a.status)).length;
  const recurringCustomers = customers.filter(c => c.status === 'cliente_recorrente').length;

  const stats = [
    { label: "Clientes Ativos", value: activeCustomers, icon: Users, color: "blue" },
    { label: "Agendamentos", value: pendingAppointments, icon: Calendar, color: "orange" },
    { label: "Concluídos", value: completedAppointments, icon: CheckCircle2, color: "emerald" },
    { label: "Recorrência", value: recurringCustomers, icon: TrendingUp, color: "pink" },
  ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'blue': return 'bg-blue-50 text-blue-600';
      case 'orange': return 'bg-orange-50 text-orange-600';
      case 'emerald': return 'bg-emerald-50 text-emerald-600';
      case 'pink': return 'bg-pink-50 text-pink-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="p-6 rounded-[2rem] border-slate-100 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getColorClasses(stat.color)}`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
