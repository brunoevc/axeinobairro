import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Sparkles,
  UtensilsCrossed,
  ShoppingBasket,
  Croissant,
  Pill,
  Scissors,
  Wrench,
  PawPrint,
  Flame,
  Zap,
} from "lucide-react";
import logo from "@/assets/logo.jpg";
import { merchants, categories, neighborhoods } from "@/data/merchants";
import { MerchantCard } from "@/components/MerchantCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Axêi no Bairro — Encontre comércios perto de você" },
      {
        name: "description",
        content:
          "Descubra restaurantes, mercados, padarias e serviços do seu bairro. Fale direto pelo WhatsApp em segundos.",
      },
      { property: "og:title", content: "Axêi no Bairro" },
      {
        property: "og:description",
        content: "O marketplace hiperlocal do seu bairro. Encontre e chame no WhatsApp.",
      },
    ],
  }),
});

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

function Index() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [neighborhood, setNeighborhood] = useState<string>(neighborhoods[0]);

  const filtered = useMemo(() => {
    return merchants.filter((m) => {
      const matchesQ =
        !query ||
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase());
      const matchesCat = category === "all" || m.category === category;
      const matchesHood =
        neighborhood === neighborhoods[0] || m.neighborhood === neighborhood;
      return matchesQ && matchesCat && matchesHood;
    });
  }, [query, category, neighborhood]);

  const featured = filtered.filter((m) => m.featured);
  const fresh = filtered.filter((m) => m.isNew);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Hero */}
      <header
        className="relative overflow-hidden rounded-b-[2rem] px-5 pb-8 pt-6 text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Axêi no Bairro"
            className="h-11 w-11 rounded-xl shadow-lg"
          />
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/60">
              Axêi no Bairro
            </p>
            <h1 className="text-lg font-semibold leading-tight">
              Comércio perto de você
            </h1>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold leading-tight">
            Encontre tudo do seu bairro
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              em poucos segundos.
            </span>
          </h2>
          <p className="mt-1.5 text-sm text-white/70">
            Restaurantes, mercados e serviços a um WhatsApp de distância.
          </p>
        </div>

        {/* Search */}
        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-[var(--shadow-glow)]">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar comércios ou serviços"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* Neighborhood */}
        <div className="mt-3 flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-white/70" />
          <select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="flex-1 cursor-pointer appearance-none rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {neighborhoods.map((n) => (
              <option key={n} value={n} className="text-foreground">
                {n}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Categories */}
      <section className="px-1 pt-5">
        <div className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => {
            const Icon = iconMap[c.icon as keyof typeof iconMap];
            const active = category === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setCategory(c.slug)}
                className={`flex shrink-0 flex-col items-center gap-1.5 rounded-2xl px-4 py-3 text-xs font-medium transition-all ${
                  active
                    ? "text-white shadow-[var(--shadow-glow)]"
                    : "bg-card text-foreground shadow-[var(--shadow-card)] hover:-translate-y-0.5"
                }`}
                style={
                  active ? { background: "var(--gradient-brand)" } : undefined
                }
              >
                <Icon className="h-5 w-5" />
                <span className="whitespace-nowrap">{c.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mt-6 px-5">
          <SectionHeader
            icon={<Flame className="h-4 w-4 text-accent" />}
            title="Em destaque"
            subtitle="Os preferidos do seu bairro"
          />
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {featured.map((m) => (
              <div key={m.id} className="w-[88%] shrink-0">
                <MerchantCard merchant={m} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* New */}
      {fresh.length > 0 && (
        <section className="mt-6 px-5">
          <SectionHeader
            icon={<Sparkles className="h-4 w-4 text-accent" />}
            title="Novos comércios"
            subtitle="Acabaram de chegar por aqui"
          />
          <div className="mt-3 grid gap-3">
            {fresh.map((m) => (
              <MerchantCard key={m.id} merchant={m} />
            ))}
          </div>
        </section>
      )}

      {/* All */}
      <section className="mt-6 px-5">
        <SectionHeader
          icon={<Zap className="h-4 w-4 text-accent" />}
          title={`${filtered.length} comércios`}
          subtitle="Próximos de você agora"
        />
        {filtered.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-card p-8 text-center shadow-[var(--shadow-card)]">
            <p className="text-sm font-medium text-foreground">
              Nada encontrado por aqui.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tente outro bairro ou categoria.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setNeighborhood(neighborhoods[0]);
              }}
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="mt-3 grid gap-3">
            {filtered.map((m) => (
              <MerchantCard key={m.id} merchant={m} />
            ))}
          </div>
        )}
      </section>

      <footer className="mt-10 px-5 text-center text-xs text-muted-foreground">
        Feito com ❤ para o seu bairro · Axêi no Bairro
      </footer>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <div className="flex items-center gap-1.5">
          {icon}
          <h3 className="text-base font-bold text-foreground">{title}</h3>
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
