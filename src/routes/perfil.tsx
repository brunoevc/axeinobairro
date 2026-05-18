import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, User, MapPin, Bell, Shield, Settings, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/perfil")({
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState("João");

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 pt-12 pb-8 bg-gradient-to-b from-primary/10 to-transparent">
        <button onClick={() => navigate({ to: "/" })} className="mb-6 p-2 bg-card rounded-full shadow-sm">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-primary to-accent p-1 shadow-xl">
            <div className="w-full h-full rounded-[1.8rem] bg-card flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Vila Madalena, SP
            </p>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-8 pb-32">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 px-2">Preferências do Bairro</h2>
          <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
            {[
              { icon: User, label: "Nome", value: name },
              { icon: MapPin, label: "Meu Bairro", value: "Vila Madalena" },
              { icon: Sparkles, label: "Signo", value: "Leão" }
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-5 ${i !== 2 ? 'border-b border-border/30' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-secondary rounded-xl"><item.icon className="h-4 w-4 text-primary" /></div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  {item.value}
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 px-2">Configurações</h2>
          <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
            {[
              { icon: Bell, label: "Notificações", value: "Ativadas" },
              { icon: Shield, label: "Privacidade", value: "" },
              { icon: Settings, label: "Minha Home", value: "Personalizar" }
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-5 ${i !== 2 ? 'border-b border-border/30' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-secondary rounded-xl"><item.icon className="h-4 w-4 text-primary" /></div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  {item.value}
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <button 
          onClick={() => navigate({ to: '/admin' })}
          className="w-full py-4 bg-secondary text-primary font-bold rounded-2xl hover:bg-primary/10 transition-colors"
        >
          Acessar Painel Admin
        </button>
      </main>
    </div>
  );
}

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);
