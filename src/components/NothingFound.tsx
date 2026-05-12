import { Button } from "@/components/ui/button";

type NothingFoundProps = {
  onClearFilters: () => void;
};

export function NothingFound({ onClearFilters }: NothingFoundProps) {
  return (
    <div className="mt-4 rounded-2xl bg-card p-8 text-center shadow-[var(--shadow-card)]">
      <p className="text-sm font-medium text-foreground">Nada encontrado por aqui.</p>
      <p className="mt-1 text-xs text-muted-foreground">Tente outro bairro ou categoria.</p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onClearFilters}>
        Limpar filtros
      </Button>
    </div>
  );
}
