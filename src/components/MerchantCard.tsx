import { MapPin, Star, Bike, MessageCircle, Instagram, Clock, Tag } from "lucide-react";
import type { Merchant } from "@/data/merchants";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

type Props = { merchant: Merchant };

export function PromotionBadge() {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-orange">
      <Tag className="h-3 w-3" />
      Promoção ativa
    </div>
  );
}

export function MerchantCard({ merchant }: Props) {
  const waUrl = `https://wa.me/${merchant.whatsapp}?text=${encodeURIComponent(
    `Olá ${merchant.name}! Vi sua oferta no Axêi no Bairro e gostaria de mais informações 👋`
  )}`;

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-[2rem] bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] border border-border/40"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={merchant.image} 
          alt={merchant.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {merchant.promotion.isActive && <PromotionBadge />}
          <div className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2 py-1 text-[10px] font-bold uppercase text-white border border-white/20">
            {merchant.category}
          </div>
        </div>
      </div>

      <div className="flex flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-foreground">
              {merchant.name}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {merchant.neighborhood}
            </div>
          </div>
          <div className="flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
            <Star className="h-3 w-3 fill-primary" />
            {merchant.rating.toFixed(1)}
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
          {merchant.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {merchant.isOpen ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-whatsapp/10 px-2 py-0.5 text-[11px] font-bold text-whatsapp">
              <Clock className="h-3 w-3" />
              Aberto
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
              <Clock className="h-3 w-3" />
              Fechado
            </span>
          )}
          {merchant.delivery && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-bold text-accent">
              <Bike className="h-3 w-3" />
              Entrega
            </span>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <Button
            asChild
            variant="outline"
            className="flex-1 rounded-xl h-11 text-xs font-bold border-border/60"
          >
            <Link to="/negocios/$id" params={{ id: merchant.id }}>
              Ver detalhes
            </Link>
          </Button>
          <Button
            asChild
            variant="whatsapp"
            className="flex-1 rounded-xl h-11 text-xs font-bold shadow-lg shadow-whatsapp/20"
          >
            <a href={waUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}