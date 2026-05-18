import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, Edit, Trash2, LayoutDashboard, Newspaper, Tag, Calendar, Wrench } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
});

function AdminPanel() {
  const navigate = useNavigate();

  const sections = [
    { label: "Notícias", icon: Newspaper, count: 12 },
    { label: "Ofertas", icon: Tag, count: 24 },
    { label: "Eventos", icon: Calendar, count: 8 },
    { label: "Serviços", icon: Wrench, count: 42 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 pt-10 pb-6 border-b border-border bg-card">
        <div className="flex justify-between items-center">
          <button onClick={() => navigate({ to: "/" })} className="p-2 hover:bg-secondary rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold">Painel Admin</h1>
          <div className="w-9 h-9" />
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-primary/10 rounded-3xl border border-primary/20">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Acessos Hoje</p>
            <p className="text-3xl font-bold text-primary">1.240</p>
          </div>
          <div className="p-5 bg-accent/10 rounded-3xl border border-accent/20">
            <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Interações IA</p>
            <p className="text-3xl font-bold text-accent">312</p>
          </div>
        </div>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Gerenciar Conteúdo
            </h2>
            <button className="p-2 bg-primary text-white rounded-xl shadow-lg active:scale-95 transition-all">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.label} className="bg-card p-4 rounded-2xl border border-border/50 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-secondary rounded-xl">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{section.label}</h3>
                    <p className="text-xs text-muted-foreground">{section.count} itens ativos</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground"><Edit className="h-4 w-4" /></button>
                  <button className="p-2 hover:bg-secondary rounded-lg text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card border border-border/50 rounded-3xl p-6">
          <h2 className="font-bold mb-4">Mensagem do Dia (IA)</h2>
          <textarea 
            className="w-full bg-secondary/50 border border-border/50 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-colors h-32"
            defaultValue="Sorria! Hoje é um ótimo dia para descobrir algo novo no seu bairro. Que tal visitar o Mercadinho do Zé?"
          />
          <button className="mt-4 w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all">
            Salvar e Atualizar
          </button>
        </section>
      </main>
    </div>
  );
}
