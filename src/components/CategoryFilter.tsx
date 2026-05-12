import {
  Sparkles,
  UtensilsCrossed,
  ShoppingBasket,
  Croissant,
  Pill,
  Scissors,
  Wrench,
  PawPrint,
} from "lucide-react";

type Category = {
  slug: string;
  label: string;
  icon: string;
};

type CategoryFilterProps = {
  categories: Category[];
  category: string;
  onCategoryChange: (value: string) => void;
};

const iconMap = {
  Sparkles,
  UtensilsCrossed,
  ShoppingBasket,
  Croissant,
  Pill,
  Scissors,
  Wrench,
  PawPrint,
} as const;

export function CategoryFilter({ categories, category, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap];
        const active = category === item.slug;

        return (
          <button
            key={item.slug}
            onClick={() => onCategoryChange(item.slug)}
            className={`flex shrink-0 flex-col items-center gap-1.5 rounded-2xl px-4 py-3 text-xs font-medium transition-all ${
              active
                ? "text-white shadow-[var(--shadow-glow)]"
                : "bg-card text-foreground shadow-[var(--shadow-card)] hover:-translate-y-0.5"
            }`}
            style={active ? { background: "var(--gradient-brand)" } : undefined}
          >
            <Icon className="h-5 w-5" />
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
