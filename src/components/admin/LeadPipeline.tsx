
import { Lead, LeadStatus } from "@/types/leads";
import { 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  User, 
  XCircle, 
  Star,
  ChevronRight,
  TrendingUp,
  Tag,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateLead } from "@/lib/leads";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeadPipelineProps {
  leads: Lead[];
  onUpdate: () => void;
  merchants: any[];
}

const statusConfig: Record<LeadStatus, { label: string; icon: any; color: string; bgColor: string }> = {
  novo: { label: "Novo", icon: Clock, color: "text-blue-600", bgColor: "bg-blue-50" },
  em_atendimento: { label: "Em Atendimento", icon: MessageSquare, color: "text-orange-600", bgColor: "bg-orange-50" },
  interessado: { label: "Interessado", icon: Star, color: "text-violet-600", bgColor: "bg-violet-50" },
  cliente: { label: "Cliente", icon: CheckCircle2, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  perdido: { label: "Perdido", icon: XCircle, color: "text-slate-400", bgColor: "bg-slate-50" },
};

const sourceLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  pedido: "Pedido",
  share: "Compartilhou",
  promocao: "Promoção",
};

export function LeadPipeline({ leads, onUpdate, merchants }: LeadPipelineProps) {
  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    updateLead(id, { status: newStatus });
    toast.success(`Status atualizado para ${statusConfig[newStatus].label}`);
    onUpdate();
  };

  const columns: LeadStatus[] = ["novo", "em_atendimento", "interessado", "cliente", "perdido"];

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
      {columns.map((status) => {
        const columnLeads = leads.filter((l) => l.status === status);
        const config = statusConfig[status];

        return (
          <div key={status} className="flex-shrink-0 w-80">
            <div className="mb-4 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className={cn("p-1.5 rounded-lg", config.bgColor, config.color)}>
                  <config.icon className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">{config.label}</h3>
              </div>
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                {columnLeads.length}
              </span>
            </div>

            <div className="space-y-4">
              {columnLeads.length === 0 ? (
                <div className="h-24 border-2 border-dashed border-slate-100 rounded-[2rem] flex items-center justify-center">
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Vazio</p>
                </div>
              ) : (
                columnLeads.map((lead) => {
                  const merchant = merchants.find(m => m.id === lead.merchantId);
                  return (
                    <div 
                      key={lead.id} 
                      className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                            <User className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 leading-none mb-1">{lead.customerName}</p>
                            <p className="text-[10px] font-bold text-slate-400">{lead.customerPhone}</p>
                          </div>
                        </div>
                        <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                          <TrendingUp className="w-3.3 h-3.3 text-slate-300 group-hover:text-orange-500" />
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3 h-3 text-slate-300" />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
                            Origem: {sourceLabels[lead.source]}
                          </span>
                        </div>
                        {merchant && (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-100 flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-orange-600" />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 truncate max-w-[150px]">
                              Loja: {merchant.name}
                            </span>
                          </div>
                        )}
                        {lead.estimatedValue && (
                          <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 rounded-lg w-fit border border-emerald-100">
                            <DollarSign className="w-3 h-3 text-emerald-600" />
                            <span className="text-[10px] font-black text-emerald-600">
                              R$ {lead.estimatedValue.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1 pt-3 border-t border-slate-50">
                        <p className="text-[9px] font-bold text-slate-300">
                          {format(new Date(lead.createdAt), "dd MMM, HH:mm", { locale: pt_BR })}
                        </p>
                        <div className="flex gap-1">
                          {status !== "cliente" && (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-7 w-7 rounded-full hover:bg-emerald-50 hover:text-emerald-600"
                              onClick={() => handleStatusChange(lead.id, "cliente")}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 rounded-full hover:bg-orange-50 hover:text-orange-600"
                            onClick={() => {
                              const nextIdx = columns.indexOf(status) + 1;
                              if (nextIdx < columns.length) handleStatusChange(lead.id, columns[nextIdx]);
                            }}
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
