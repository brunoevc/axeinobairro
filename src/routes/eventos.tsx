import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar } from "lucide-react";

export const Route = createFileRoute("/eventos")({ 
  component: EventosPage 
});

function EventosPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8">
        <Calendar className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-3xl font-black text-foreground mb-4">Eventos no Bairro</h1>
      <p className="text-muted-foreground font-medium mb-12 max-w-xs leading-relaxed">
        Feiras, shows, encontros e muito mais. Descubra a agenda cultural da sua comunidade em breve.
      </p>
      <Link to="/" className="px-8 py-4 bg-primary text-white font-black text-sm rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Voltar para o início
      </Link>
    </div>
  );
}