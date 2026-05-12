import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Sparkles,
  UtensilsCrossed,
  ShoppingBasket,
  Croissant,
  Pill,
  Scissors,
  Wrench,
  PawPrint,
  Flame,
} from "lucide-react";
import logo from "@/assets/logo.jpg";
import { merchants, categories, neighborhoods } from "@/data/merchants";
import { MerchantCard } from "@/components/MerchantCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SearchBar } from "@/components/SearchBar";
import { NeighborhoodFilter } from "@/components/NeighborhoodFilter";
import { CategoryFilter } from "@/components/CategoryFilter";
import { MerchantList } from "@/components/MerchantList";

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

function Index() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [neighborhood, setNeighborhood] = useState<string>(neighborhoods[0]);

  const planPriority = {
    premium_partner: 5,
    highlighted: 4,
    local_featured: 3,
    assisted: 2,
    free: 1,
  } as const;

  const filtered = useMemo(() => {
    return merchants
      .filter((m) => {
        const matchesQ =
          !query ||
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.description.toLowerCase().includes(query.toLowerCase());
        const matchesCat = category === "all" || m.category === category;
        const matchesHood =
          neighborhood === neighborhoods[0] || m.neighborhood === neighborhood;
        return matchesQ && matchesCat && matchesHood;
      })
      .sort((a, b) => {
        const priorityA = planPriority[a.plan] ?? 0;
        const priorityB = planPriority[b.plan] ?? 0;
        return priorityB - priorityA;
      });
  }, [query, category, neighborhood]);

  const featured = filtered.filter((m) => m.featured);
  const fresh = filtered.filter((m) => m.isNew);

  const handleClearFilters = () => {
    setQuery("");
    setCategory("all");
    setNeighborhood(neighborhoods[0]);
  };

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

        <SearchBar query={query} onQueryChange={setQuery} />
        <NeighborhoodFilter
          neighborhood={neighborhood}
          neighborhoods={neighborhoods}
          onNeighborhoodChange={setNeighborhood}
        />
      </header>

      {/* Categories */}
      <section className="px-1 pt-5">
        <CategoryFilter
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
        />
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
      <MerchantList filtered={filtered} onClearFilters={handleClearFilters} />

      <footer className="mt-10 px-5 text-center text-xs text-muted-foreground">
        Feito com ❤ para o seu bairro · Axêi no Bairro
      </footer>
    </div>
  );
}

