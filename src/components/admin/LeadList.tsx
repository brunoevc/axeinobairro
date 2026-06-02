
import { Lead, LeadStatus } from "@/types/leads";
import { 
  User, 
  Tag, 
  Calendar, 
  DollarSign, 
  Search, 
  Filter,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { updateLead } from "@/lib/leads";
import { toast } from "sonner";
import { useState } from "react";

interface LeadListProps {
  leads: Lead[];
  merchants: any[];
  onUpdate: () => void;
}

const statusConfig: Record<LeadStatus, { label: string; color: string; bgColor: string }> = {
  novo: { label: "Novo", color: "text-blue-600", bgColor: "bg-blue-50" },
  em_atendimento: { label: "Atendimento", color: "text-orange-600", bgColor: "bg-orange-50" },
  interessado: { label: "Interessado", color: "text-violet-600", bgColor: "bg-violet-50" },
  cliente: { label: "Cliente", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  perdido: { label: "Perdido", color: "text-slate-400", bgColor: "bg-slate-50" },
};

const sourceLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  pedido: "Pedido",
  share: "Compartilhamento",
  promocao: "Promoção",
};

export function LeadList({ leads, merchants, onUpdate }: LeadListProps) {
  const [filterMerchant, setFilterMerchant] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    updateLead(id, { status: newStatus });
    toast.success(`Lead atualizado`);
    onUpdate();
  };

  const filteredLeads = leads.filter(lead => {
    if (filterMerchant !== "all" && lead.merchantId !== filterMerchant) return false;
    if (filterStatus !== "all" && lead.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="flex flex-wrap gap-2">
          <select 
            className="h-11 px-4 rounded-xl border border-slate-100 bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos Status</option>
            {Object.entries(statusConfig).map(([id, config]) => (
              <option key={id} value={id}>{config.label}</option>
            ))}
          </select>

          <select 
            className="h-11 px-4 rounded-xl border border-slate-100 bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            value={filterMerchant}
            onChange={(e) => setFilterMerchant(e.target.value)}
          >
            <option value="all">Todas Lojas</option>
            {merchants.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Mostrando {filteredLeads.length} contatos
        </div>
      </div>

      <div className="overflow-x-auto -mx-8 px-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cliente</th>
              <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loja</th>
              <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Origem</th>
              <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Valor</th>
              <th className="text-right py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <p className="text-sm font-bold text-slate-400">Nenhum lead encontrado com os filtros selecionados.</p>
                </td>
              </tr>
            ) : (
              filteredLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((lead) => {
                const merchant = merchants.find(m => m.id === lead.merchantId);
                const config = statusConfig[lead.status];

                return (
                  <tr key={lead.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:bg-white group-hover:shadow-sm transition-all">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-tight">{lead.customerName}</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-0.5">{lead.customerPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-xs font-black text-slate-700">{merchant?.name || 'Loja removida'}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                        config.bgColor,
                        config.color,
                        "border-" + config.color.split('-')[1] + "-100"
                      )}>
                        {config.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-[11px] font-bold text-slate-500">{sourceLabels[lead.source]}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {lead.estimatedValue ? (
                        <span className="text-xs font-black text-emerald-600">
                          R$ {lead.estimatedValue.toFixed(2).replace('.', ',')}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:shadow-sm">
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl border-slate-100 shadow-xl p-2">
                          <DropdownMenuItem onClick={() => handleStatusChange(lead.id, "em_atendimento")} className="rounded-xl text-xs font-black uppercase tracking-widest p-3">
                            Em Atendimento
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(lead.id, "interessado")} className="rounded-xl text-xs font-black uppercase tracking-widest p-3">
                            Marcar Interessado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(lead.id, "cliente")} className="rounded-xl text-xs font-black uppercase tracking-widest p-3 text-emerald-600">
                            Marcar como Cliente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(lead.id, "perdido")} className="rounded-xl text-xs font-black uppercase tracking-widest p-3 text-slate-400">
                            Marcar como Perdido
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
