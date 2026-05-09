import { MapPin, Star, Bike, MessageCircle } from "lucide-react";
import type { Merchant } from "@/data/merchants";
import { Button } from "@/components/ui/button";

type Props = { merchant: Merchant };

export function MerchantCard({ merchant }: Props) {
  const waUrl = `https://wa.me/${merchant.whatsapp}?text=${encodeURIComponent(
    `Olá ${merchant.name}! Vim pelo Axêi no Bairro 👋`
  )}`;

  return (
    <article className="group rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]">
      <div className="flex gap-3">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-3xl"
          style={{ background: "var(--gradient-brand)" }}
          aria-hidden
        >
          <span>{merchant.emoji}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-base font-semibold text-foreground">
              {merchant.name}
            </h3>
            <div className="flex items-center gap-0.5 text-xs font-medium text-foreground">
              <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
              {merchant.rating.toFixed(1)}
            </div>
          </div>

          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {merchant.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
              <MapPin className="h-3 w-3" />
              {merchant.neighborhood}
            </span>
            {merchant.isOpen ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-whatsapp/10 px-2 py-0.5 font-medium text-whatsapp">
                <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" />
                Aberto agora
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                Fechado
              </span>
            )}
            {merchant.delivery && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 font-medium text-accent">
                <Bike className="h-3 w-3" />
                Entrega
              </span>
            )}
          </div>
        </div>
      </div>

      <Button
        asChild
        variant="whatsapp"
        size="lg"
        className="mt-3 w-full"
      >
        <a href={waUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-5 w-5" />
          Chamar no WhatsApp
        </a>
      </Button>
    </article>
  );
}
