import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/servicos")({ component: () => <PlaceholderPage title="Serviços" /> });
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-10 text-center">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="mt-4 text-muted-foreground">Página em construção para esta versão futurista.</p>
    <button onClick={() => window.history.back()} className="mt-8 text-primary font-bold">Voltar</button>
  </div>
);
