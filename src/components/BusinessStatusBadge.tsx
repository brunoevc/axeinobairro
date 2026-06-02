import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessStatusBadgeProps {
  isOpen: boolean;
  hours: string;
  className?: string;
}

export function BusinessStatusBadge({ isOpen, hours, className }: BusinessStatusBadgeProps) {
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
