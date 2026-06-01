import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, User, MapPin, Bell, Shield, Settings, ChevronRight, Store, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/perfil")({
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState("Morador do Bairro");

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 pt-12 pb-8 bg-gradient-to-b from-primary/10 to-transparent">
        <button onClick={() => navigate({ to: "/" })} className="mb-6 p-2 bg-card rounded-full shadow-sm border border-border/40">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[2.5rem] bg-gradient-to-tr from-primary to-accent p-1 shadow-xl">
            <div className="w-full h-full rounded-[2.3rem] bg-card flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">{name}</h1>
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3 text-primary" /> Vila Madalena, SP
            </p>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-8 pb-32">
        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 px-2">Minha Conta</h2>
          <div className="bg-card border border-border/50 rounded-[2.5rem] overflow-hidden shadow-sm">
            {[
              { icon: User, label: "Nome", value: name },
              { icon: MapPin, label: "Meu Bairro", value: "Centro" },
              { icon: Sparkles, label: "Meus Interesses", value: "Pizza, Café, Pet" }
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-5 ${i !== 2 ? 'border-b border-border/30' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-secondary/50 rounded-xl"><item.icon className="h-4 w-4 text-primary" /></div>
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  {item.value}
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 px-2">Para Lojistas</h2>
          <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-black text-foreground mb-2">Você tem um negócio?</h3>
            <p className="text-sm text-muted-foreground mb-6 font-medium leading-relaxed">
              Anuncie no Axêi no Bairro e apareça para milhares de moradores locais.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => navigate({ to: '/cadastro' })}
                className="w-full py-4 bg-primary text-white font-black text-sm rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                Cadastrar agora
              </button>
              <button 
                onClick={() => navigate({ to: '/admin/lojas' })}
                className="w-full py-4 bg-card border border-border/60 text-foreground font-black text-sm rounded-2xl active:scale-95 transition-all"
              >
                Acessar meu painel
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 px-2">Configurações</h2>
          <div className="bg-card border border-border/50 rounded-[2.5rem] overflow-hidden shadow-sm">
            {[
              { icon: Bell, label: "Notificações", value: "Ativadas" },
              { icon: Shield, label: "Privacidade", value: "" },
              { icon: Settings, label: "Aparência", value: "Moderno" }
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-5 ${i !== 2 ? 'border-b border-border/30' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-secondary/50 rounded-xl"><item.icon className="h-4 w-4 text-primary" /></div>
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                  {item.value}
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}