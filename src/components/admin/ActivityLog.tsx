import { AdminAction } from "@/data/admin";
import { CheckCircle2, XCircle, TrendingUp, RefreshCcw, FileText, MessageCircle } from "lucide-react";
import React from "react";

const actionTypeConfig = {
  approve: { label: "Aprovado", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
  reject: { label: "Rejeitado", icon: XCircle, color: "text-red-500 bg-red-50 border-red-100" },
  plan_change: { label: "Plano Alterado", icon: TrendingUp, color: "text-blue-500 bg-blue-50 border-blue-100" },
  status_change: { label: "Status Alterado", icon: RefreshCcw, color: "text-violet-500 bg-violet-50 border-violet-100" },
  note_added: { label: "Nota Adicionada", icon: FileText, color: "text-slate-500 bg-slate-50 border-slate-100" },
  contact: { label: "Contato", icon: MessageCircle, color: "text-amber-500 bg-amber-50 border-amber-100" },
};

export function ActivityLog({ actions }: { actions: AdminAction[] }) {
  const recentActions = actions.slice(0, 10);

  if (recentActions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
           <FileText className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Nenhuma atividade registrada ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {recentActions.map((action) => {
        const timestamp = new Date(action.timestamp);
        const config = actionTypeConfig[action.type];
        const Icon = config.icon;
        
        const timeStr = timestamp.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const dateStr = timestamp.toLocaleDateString("pt-BR", {
           day: 'numeric',
           month: 'short'
        });

        return (
          <div
            key={action.id}
            className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
          >
            <div className={`p-2.5 rounded-xl border shadow-sm shrink-0 transition-transform group-hover:scale-110 ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-black text-slate-900 truncate tracking-tight">
                  {action.merchantName}
                </p>
                <span className="text-[10px] font-black text-slate-400 whitespace-nowrap uppercase tracking-widest">
                  {dateStr}, {timeStr}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-500">
                <span className={`${config.color.split(' ')[0]} uppercase tracking-widest text-[9px] font-black`}>
                   {config.label}
                </span>
                {action.details.reason && (
                   <>
                     <span className="text-slate-200">/</span>
                     <span className="truncate max-w-[150px]">{action.details.reason}</span>
                   </>
                )}
                {action.details.newValue && (
                   <>
                     <span className="text-slate-200">/</span>
                     <span className="text-violet-600">Para: {action.details.newValue}</span>
                   </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
