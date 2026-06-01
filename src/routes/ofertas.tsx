import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Tag } from "lucide-react";
import { merchants } from "@/data/merchants";
import { MerchantCard } from "@/components/MerchantCard";

export const Route = createFileRoute("/ofertas")({ 
  component: OffersPage 
});

function OffersPage() {
  const promotionalMerchants = merchants.filter(m => m.promotion.isActive);

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="px-6 pt-12 pb-8 bg-card border-b border-border/40 relative overflow-hidden">
        <Link 
          to="/"
          className="mb-6 p-3 bg-secondary/50 rounded-full border border-border/40 active:scale-90 transition-all inline-flex"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-foreground leading-tight flex items-center gap-3">
            <Tag className="h-8 w-8 text-primary" />
            Ofertas do <span className="text-primary">Bairro</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-2 max-w-xs leading-relaxed">
            Economize comprando perto de casa com descontos exclusivos.
          </p>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotionalMerchants.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} />
          ))}
        </div>

        {promotionalMerchants.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-medium">Nenhuma oferta ativa no momento.</p>
          </div>
        )}
      </main>
    </div>
  );
}