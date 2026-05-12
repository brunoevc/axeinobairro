import { AdminAction } from "@/data/admin";

const actionTypeLabels = {
  approve: "✅ Aprovado",
  reject: "❌ Rejeitado",
  plan_change: "📈 Plano Alterado",
  status_change: "🔄 Status Alterado",
  note_added: "📝 Nota Adicionada",
  contact: "💬 Contato",
};

export function ActivityLog({ actions }: { actions: AdminAction[] }) {
  const recentActions = actions.slice(0, 8);

  if (recentActions.length === 0) {
    return (
      <div className="rounded-xl bg-card p-6 border border-accent/10 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-4">Atividade Recente</h3>
        <p className="text-sm text-muted-foreground">Nenhuma atividade registrada ainda</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card p-6 border border-accent/10 shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-4">Atividade Recente</h3>

      <div className="space-y-3">
        {recentActions.map((action) => {
          const timestamp = new Date(action.timestamp);
          const timeStr = timestamp.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const dateStr = timestamp.toLocaleDateString("pt-BR");

          return (
            <div
              key={action.id}
              className="flex items-start gap-3 pb-3 border-b border-border last:border-b-0 last:pb-0"
            >
              <div className="text-lg mt-1">
                {action.type === "approve" && "✅"}
                {action.type === "reject" && "❌"}
                {action.type === "plan_change" && "📈"}
                {action.type === "status_change" && "🔄"}
                {action.type === "note_added" && "📝"}
                {action.type === "contact" && "💬"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {action.merchantName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {actionTypeLabels[action.type]}
                  {action.details.reason && ` • ${action.details.reason}`}
                  {action.details.newValue && ` • Para: ${action.details.newValue}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {dateStr} às {timeStr}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
