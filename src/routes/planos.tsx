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
    description: "Cadastro básico com visibilidade na sua região.",
    benefits: [
      "Nome da empresa, categoria e bairro",
      "Endereço e horário de funcionamento",
      "Contato direto pelo WhatsApp",
      "Exibição na busca local",
      "Card simples no app",
      "Status ativo após aprovação",
    ],
    whatsappMessage:
      "Olá! Quero criar meu perfil grátis no Axêi no Bairro. Como funciona?",
  },
  {
    id: "assisted",
    title: "Cadastro Assistido",
    price: 27,
    description: "Seu perfil feito pela equipe Axêi. Mais completo e profissional.",
    benefits: [
      "Tudo do plano grátis",
      "Cadastro criado pela equipe Axêi",
      "Descrição comercial otimizada",
      "Até 3 fotos/logo da loja",
      "Link Google Maps integrado",
      "WhatsApp ajustado e testado",
      "Publicação mais rápida",
      "Suporte inicial via WhatsApp",
    ],
    whatsappMessage:
      "Olá! Tenho interesse no plano Cadastro Assistido (R$27). Quero saber mais!",
  },
  {
    id: "local_featured",
    title: "Destaque Local",
    price: 47,
    description:
      "Apareça em destaque no seu bairro e categoria. O melhor custo-benefício.",
    benefits: [
      "Tudo do plano R$27",
      "Selo 'Destaque Local' no seu card",
      "Prioridade acima dos perfis gratuitos",
      "Destaque na categoria",
      "Aparição garantida na seção 'Em destaque'",
      "Até 5 fotos do seu comércio",
      "Instagram ou Facebook integrados",
      "Botão WhatsApp destacado",
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
    description: "Prioridade máxima na listagem com banner e destaque visual.",
    benefits: [
      "Tudo do plano R$47",
      "Prioridade maior na listagem",
      "Destaque visual superior no card",
      "Banner simples da sua loja",
      "Inclusão em campanhas locais",
      "Até 10 fotos para showcase",
      "Redes sociais completas (todas)",
      "Chamada comercial personalizada",
      "Relatório simples de cliques/contatos",
      "Suporte prioritário",
    ],
    whatsappMessage:
      "Olá! Tenho interesse no plano Loja em Destaque (R$97). Quero mais informações.",
  },
  {
    id: "premium",
    title: "Parceiro Premium",
    price: 147,
    description: "Máxima exposição com página completa e catálogo de produtos.",
    benefits: [
      "Tudo do plano R$97",
      "Prioridade máxima em toda plataforma",
      "Selo 'Parceiro Premium' exclusivo",
      "Banner premium da loja",
      "Página da loja mais completa",
      "Catálogo básico de produtos/serviços",
      "Múltiplos links (WhatsApp, Instagram, Facebook, site)",
      "Destaque em campanhas do bairro",
      "Divulgação em materiais do Axêi",
      "Relatório mensal completo",
      "Suporte VIP prioritário",
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

        {/* Deliverables comparison */}
        <section className="mb-10 rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-lg font-bold text-foreground mb-6">
            Entregáveis em cada plano
          </h3>
          <div className="space-y-6 text-sm">
            <div className="border-l-4 border-accent pl-4">
              <p className="font-bold text-foreground mb-2">Presença Local (Grátis)</p>
              <p className="text-muted-foreground mb-2">
                Cadastro básico para começar a receber clientes:
              </p>
              <p className="text-xs text-muted-foreground">
                Nome, categoria, bairro, endereço, horário, WhatsApp, card simples, exibição na busca
              </p>
            </div>
            <div className="border-l-4 border-accent pl-4">
              <p className="font-bold text-foreground mb-2">Cadastro Assistido (R$27)</p>
              <p className="text-muted-foreground mb-2">
                Nossa equipe monta seu perfil profissional:
              </p>
              <p className="text-xs text-muted-foreground">
                Tudo do grátis + cadastro pela equipe Axêi + até 3 fotos + descrição otimizada + Google Maps + suporte WhatsApp
              </p>
            </div>
            <div className="border-l-4 border-accent/40 bg-accent/5 rounded px-4 py-3">
              <p className="font-bold text-foreground mb-2">Destaque Local (R$47) — Melhor custo-benefício</p>
              <p className="text-muted-foreground mb-2">
                Prioridade na sua região com visibilidade garantida:
              </p>
              <p className="text-xs text-muted-foreground">
                Tudo do R$27 + selo Destaque Local + até 5 fotos + Instagram/Facebook + botão WhatsApp destacado + aparece em "Em destaque"
              </p>
            </div>
            <div className="border-l-4 border-accent pl-4">
              <p className="font-bold text-foreground mb-2">Loja em Destaque (R$97)</p>
              <p className="text-muted-foreground mb-2">
                Máxima visibilidade com banner e relatórios:
              </p>
              <p className="text-xs text-muted-foreground">
                Tudo do R$47 + banner da loja + até 10 fotos + redes sociais completas + chamada comercial personalizada + relatório de cliques
              </p>
            </div>
            <div className="border-l-4 border-accent pl-4">
              <p className="font-bold text-foreground mb-2">Parceiro Premium (R$147)</p>
              <p className="text-muted-foreground mb-2">
                Referência local com página completa e catálogo:
              </p>
              <p className="text-xs text-muted-foreground">
                Tudo do R$97 + página loja completa + catálogo produtos/serviços + todos os links + badge Premium + relatório mensal + suporte VIP
              </p>
            </div>
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
                Qual plano é melhor para começar?
              </p>
              <p className="text-muted-foreground">
                Se tem dúvida, comece com o grátis. Se quer clientes de verdade, o Destaque Local (R$47) é o melhor custo-benefício.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                O que muda entre um plano e outro?
              </p>
              <p className="text-muted-foreground">
                Quanto maior o plano, mais visibilidade, fotos, redes sociais e suporte você recebe. Todo plano inclui o anterior mais algo novo.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                Vale a pena pagar se tenho WhatsApp próprio?
              </p>
              <p className="text-muted-foreground">
                Seu WhatsApp sozinho não atrai clientes. Você precisa aparecer onde os clientes estão buscando. Aqui eles te encontram.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                Como cancelo um plano?
              </p>
              <p className="text-muted-foreground">
                Conversa conosco pelo WhatsApp. Sem burocracia, sem multa. É fácil assim.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                O que é "relatório de cliques/contatos"?
              </p>
              <p className="text-muted-foreground">
                A gente te manda quantas vezes seu card foi clicado e quantas vezes iniciaram conversa pelo WhatsApp. Você sabe se tá funcionando.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mb-10 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 p-8 shadow-[var(--shadow-card)]">
          <h3 className="text-lg font-bold text-foreground mb-3">
            Pronto para colocar sua loja em destaque?
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Escolha seu plano acima e envie uma mensagem pelo WhatsApp.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Resposta rápida e sem burocracia.
          </p>
          <Button
            asChild
            variant="whatsapp"
            size="lg"
            className="inline-flex"
          >
            <a
              href={`https://wa.me/5521999869070?text=${encodeURIComponent(
                "Olá! Quero conhecer os planos do Axêi no Bairro para minha loja"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-5 w-5" />
              Conversar com Axêi
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
