import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Plan = {
  id: string;
  title: string;
  price: number | null;
  description: string;
  benefits: string[];
  whatsappMessage: string;
  featured?: boolean;
};

type PlanCardProps = {
  plan: Plan;
};

export function PlanCard({ plan }: PlanCardProps) {
  const waUrl = `https://wa.me/5521999869070?text=${encodeURIComponent(
    plan.whatsappMessage
  )}`;

  const priceDisplay =
    plan.price === null
      ? "Grátis"
      : `R$ ${plan.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

  return (
    <div
      className={`rounded-2xl p-5 transition-all ${
        plan.featured
          ? "bg-gradient-to-br from-accent/5 to-accent/10 border-2 border-accent/30 shadow-[var(--shadow-glow)]"
          : plan.id === "premium"
            ? "bg-card border border-accent/20 shadow-[var(--shadow-card)]"
            : "bg-card border border-accent/10 shadow-[var(--shadow-card)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-lg font-bold text-foreground">{plan.title}</h3>
        {plan.featured && (
          <span className="inline-flex rounded-full bg-accent/20 px-2 py-1 text-[11px] font-semibold text-accent">
            Melhor custo-benefício
          </span>
        )}
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-foreground">{priceDisplay}</p>
        {plan.price !== null && (
          <p className="text-xs text-muted-foreground mt-1">
            {plan.price === 27
              ? "Cadastro profissional"
              : plan.price === 47
                ? "Maior visibilidade local"
                : plan.price === 97
                  ? "Prioridade no feed"
                  : "Máxima exposição"}
          </p>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

      <ul className="space-y-2 mb-5">
        {plan.benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="text-accent font-bold mt-0.5">✓</span>
            <span className="text-foreground">{benefit}</span>
          </li>
        ))}
      </ul>

      <Button asChild variant="whatsapp" size="lg" className="w-full">
        <a href={waUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-5 w-5" />
          Contratar via WhatsApp
        </a>
      </Button>
    </div>
  );
}
