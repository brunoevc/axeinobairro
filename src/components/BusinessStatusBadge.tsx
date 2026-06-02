import { Clock, ShieldCheck, Star, Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Merchant } from "@/data/merchants";


interface BusinessStatusBadgeProps {
  isOpen: boolean;
  hours: string;
  className?: string;
  status?: Merchant["status"];
  showStatusOnly?: boolean;
}


export function BusinessStatusBadge({ isOpen, hours, className, status, showStatusOnly }: BusinessStatusBadgeProps) {
  if (status && (showStatusOnly || status === "pending" || status === "rejected")) {
    const statusConfig = {
      pending: { label: "Em análise", icon: Clock, color: "bg-amber-50 text-amber-600 border-amber-100" },
      verified: { label: "Verificado", icon: ShieldCheck, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
      featured: { label: "Destaque", icon: Star, color: "bg-violet-50 text-violet-600 border-violet-100" },
      partner: { label: "Parceiro", icon: Users, color: "bg-orange-50 text-orange-600 border-orange-100" },
      rejected: { label: "Recusado", icon: AlertCircle, color: "bg-red-50 text-red-600 border-red-100" },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-tight border", config.color, className)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </div>
    );
  }

  // Safe parsing of hours
  const closingTime = hours && hours.includes("-") 
    ? hours.split("-")[1].trim() 
    : null;

  if (!isOpen) {
    return (
      <div className={cn("inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 border border-slate-200", className)}>
        <Clock className="h-3 w-3" />
        Fechado
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-100", className)}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      Aberto agora
      {closingTime ? (
        <span className="font-medium text-emerald-500/80 border-l border-emerald-200 pl-1.5 ml-1.5">
          Fecha às {closingTime}
        </span>
      ) : (
        <span className="font-medium text-emerald-500/80 border-l border-emerald-200 pl-1.5 ml-1.5">
          Consulte o horário pelo WhatsApp
        </span>
      )}
    </div>
  );
}
