import { MapPin } from "lucide-react";

type NeighborhoodFilterProps = {
  neighborhood: string;
  neighborhoods: string[];
  onNeighborhoodChange: (value: string) => void;
};

export function NeighborhoodFilter({
  neighborhood,
  neighborhoods,
  onNeighborhoodChange,
}: NeighborhoodFilterProps) {
  return (
    <div className="mt-3 flex items-center gap-2 text-sm">
      <MapPin className="h-4 w-4 text-white/70" />
      <select
        value={neighborhood}
        onChange={(event) => onNeighborhoodChange(event.target.value)}
        className="flex-1 cursor-pointer appearance-none rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {neighborhoods.map((item) => (
          <option key={item} value={item} className="text-foreground">
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
