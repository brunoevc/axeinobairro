import { createFileRoute } from "@tanstack/react-router";
import { PlanCard, type Plan } from "@/components/PlanCard";
import logo from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/planos")({
  component: PlanosPage,
  head: () => ({
    meta: [
      { title: "Planos para Lojistas — Axêi no Bairro" },
      {
        name: "description",
        content:
          "Conheça os planos do Axêi no Bairro e aumente a visibilidade da sua loja local. Venda mais pelo WhatsApp.",
      },
      { property: "og:title", content: "Planos para Lojistas — Axêi no Bairro" },
      {
        property: "og:description",
        content: "Planos simples e acessíveis para lojistas locais.",
      },
    ],
  }),
});

const plans: Plan[] = [
  {
    id: "free",
    title: "Presença Local",
    price: null,
    description: "Comece grátis e ganhe visibilidade no seu bairro.",
    benefits: [
      "Perfil básico da sua loja",
      "Listagem no marketplace local",
      "Contato direto pelo WhatsApp",
      "Categoria e descrição",
    ],
    whatsappMessage:
      "Olá! Quero criar meu perfil grátis no Axêi no Bairro. Como funciona?",
  },
  {
    id: "assisted",
    title: "Cadastro Assistido",
    price: 27,
    description: "Receba ajuda para criar um perfil profissional e atraente.",
    benefits: [
      "Suporte para montar seu cadastro",
      "Foto profissional do seu comércio",
      "Descrição otimizada",
      "Atendimento via WhatsApp",
    ],
    whatsappMessage:
      "Olá! Tenho interesse no plano Cadastro Assistido (R$27). Quero saber mais!",
  },
  {
    id: "local_featured",
    title: "Destaque Local",
    price: 47,
    description:
      "Apareça em primeiro lugar e atraia mais clientes do seu bairro.",
    benefits: [
      "Prioridade na listagem do seu bairro",
      "Badge especial destacando sua loja",
      "Mais visibilidade em buscas locais",
      "Suporte dedicado",
    ],
    whatsappMessage:
      "Olá! Quero contratar o plano Destaque Local (R$47). Como faço?",
    featured: true,
  },
  {
    id: "highlighted",
    title: "Loja em Destaque",
    price: 97,
    description: "Máxima visibilidade e se destaque dos concorrentes.",
    benefits: [
      "Posição preferencial em toda a plataforma",
      "Badge premium na sua loja",
      "Destaque visual extra no feed",
      "Prioridade de suporte",
    ],
    whatsappMessage:
      "Olá! Tenho interesse no plano Loja em Destaque (R$97). Quero mais informações.",
  },
  {
    id: "premium",
    title: "Parceiro Premium",
    price: 147,
    description: "Seja a referência local e apareça como parceiro oficial.",
    benefits: [
      "Máxima prioridade de exibição",
      "Badge Parceiro Premium exclusivo",
      "Suporte VIP e personalizado",
      "Acesso a recursos especiais",
    ],
    whatsappMessage:
      "Olá! Quero conhecer o plano Parceiro Premium (R$147). Interessado!",
  },
];

function PlanosPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header
        className="relative overflow-hidden rounded-b-[2rem] px-5 pb-10 pt-6 text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <img
            src={logo}
            alt="Axêi no Bairro"
            className="h-10 w-10 rounded-lg shadow-lg"
          />
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/60">
              Axêi no Bairro
            </p>
            <h1 className="text-lg font-semibold leading-tight">Planos</h1>
          </div>
        </div>

        <h2 className="text-2xl font-bold leading-tight mb-2">
          Aumente a visibilidade da sua loja local
          <span
            className="block bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            Venda mais pelo WhatsApp.
          </span>
        </h2>
        <p className="mt-3 text-sm text-white/70">
          Escolha o plano ideal para o seu comércio e comece a receber mais
          clientes hoje.
        </p>
      </header>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-5 py-8">
        {/* Intro */}
        <section className="mb-10 text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">
            Por que usar Axêi no Bairro?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Conectamos clientes locais à sua loja de forma simples. Sem
            intermediários, sem taxas por venda. Você vende, você ganha.
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="font-bold text-foreground">Grátis</p>
              <p className="text-muted-foreground">Começar</p>
            </div>
            <div>
              <p className="font-bold text-foreground">Simples</p>
              <p className="text-muted-foreground">WhatsApp</p>
            </div>
            <div>
              <p className="font-bold text-foreground">Local</p>
              <p className="text-muted-foreground">Seu bairro</p>
            </div>
          </div>
        </section>

        {/* Plans grid */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-foreground mb-5 text-center">
            Escolha seu plano
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className={plan.featured ? "lg:col-span-3 max-w-lg mx-auto w-full md:max-w-none" : ""}>
                <PlanCard plan={plan} />
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10 rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Perguntas frequentes
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-foreground mb-1">
                Como funciona o pagamento?
              </p>
              <p className="text-muted-foreground">
                Enviamos um link de pagamento via WhatsApp. Aceitamos Pix,
                débito e crédito.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                Posso cancelar meu plano?
              </p>
              <p className="text-muted-foreground">
                Sim, sem problemas. Entre em contato pelo WhatsApp que
                cancelamos na hora.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                Qual plano vocês recomendam?
              </p>
              <p className="text-muted-foreground">
                Para maioria dos lojistas, o Destaque Local (R$47) é o melhor
                custo-benefício.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                E se eu não vender nada?
              </p>
              <p className="text-muted-foreground">
                Se ninguém te encontrar, a culpa é nossa. Você recebe seu
                dinheiro de volta.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mb-10 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 p-8 shadow-[var(--shadow-card)]">
          <h3 className="text-lg font-bold text-foreground mb-3">
            Pronto para começar?
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Não tem certeza qual é o melhor plano? Converse com a gente!
          </p>
          <Button
            asChild
            variant="whatsapp"
            size="lg"
            className="inline-flex"
          >
            <a
              href={`https://wa.me/5521999869070?text=${encodeURIComponent(
                "Olá, quero cadastrar minha loja no Axêi no Bairro"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-5 w-5" />
              Falar com a gente
            </a>
          </Button>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-10 px-5 py-6 border-t border-border text-center text-xs text-muted-foreground">
        Axêi no Bairro · Marketplace hiperlocal com WhatsApp
      </footer>
    </div>
  );
}
