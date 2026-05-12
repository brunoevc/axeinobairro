import { Search } from "lucide-react";

type SearchBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function SearchBar({ query, onQueryChange }: SearchBarProps) {
  return (
    <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-[var(--shadow-glow)]">
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary px-3 py-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar comércios ou serviços"
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
    </div>
  );
}
