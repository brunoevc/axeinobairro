import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Instagram as InstagramIcon, 
  MessageCircle, 
  Share2, 
  Star,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { merchants } from "@/data/merchants";
import { Button } from "@/components/ui/button";
import { PromotionBadge } from "@/components/MerchantCard";

export const Route = createFileRoute("/negocios/$id")({
  component: DetailPage,
});

function DetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const merchant = merchants.find((m) => m.id === id);

  if (!merchant) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-black text-foreground mb-2">Negócio não encontrado</h1>
        <p className="text-muted-foreground mb-8 max-w-xs leading-relaxed">
          O estabelecimento que você está procurando não existe ou foi removido.
        </p>
        <Button asChild className="rounded-2xl h-14 px-8 font-bold">
          <Link to="/negocios">Voltar para a lista</Link>
        </Button>
      </div>
    );
  }

  const waUrl = `https://wa.me/${merchant.whatsapp}?text=${encodeURIComponent(
    `Olá ${merchant.name}! Vi seu perfil no Axêi no Bairro e gostaria de mais informações 👋`
  )}`;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Cover Image & Header Actions */}
      <header className="relative h-[40vh] w-full overflow-hidden">
        <img 
          src={merchant.image} 
          alt={merchant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-10 left-6 flex items-center gap-2">
          <button 
            onClick={() => navigate({ to: "/negocios" })}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white active:scale-90 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute top-10 right-6">
          <button className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white active:scale-90 transition-all">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-black uppercase text-white">
                {merchant.category}
              </span>
              {merchant.promotion.isActive && <PromotionBadge />}
            </div>
            <h1 className="text-3xl font-black text-white leading-tight">
              {merchant.name}
            </h1>
            <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {merchant.neighborhood}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                {merchant.rating.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 mt-8 space-y-8">
        {/* Promotion Highlight */}
        {merchant.promotion.isActive && (
          <section className="bg-brand-orange/5 border border-brand-orange/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-brand-orange/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h3 className="text-brand-orange text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Oferta Especial Ativa
              </h3>
              <p className="text-lg font-bold text-foreground mb-1">{merchant.promotion.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {merchant.promotion.description}
              </p>
            </div>
          </section>
        )}

        {/* About */}
        <section>
          <h2 className="text-lg font-black text-foreground mb-3">Sobre o negócio</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {merchant.description}
          </p>
        </section>

        {/* Info Cards */}
        <section className="grid grid-cols-1 gap-4">
          <div className="flex items-start gap-4 p-5 bg-card border border-border/40 rounded-3xl shadow-sm">
            <div className="p-3 bg-secondary/50 rounded-2xl text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Horário de Funcionamento</p>
              <p className="text-sm font-bold text-foreground">{merchant.hours}</p>
              <p className={`text-[11px] font-bold mt-1 ${merchant.isOpen ? 'text-whatsapp' : 'text-muted-foreground'}`}>
                {merchant.isOpen ? '● Aberto agora' : '○ Fechado no momento'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-card border border-border/40 rounded-3xl shadow-sm">
            <div className="p-3 bg-secondary/50 rounded-2xl text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Endereço</p>
              <p className="text-sm font-bold text-foreground leading-relaxed">{merchant.address}</p>
              <p className="text-[11px] font-bold text-muted-foreground mt-1">{merchant.neighborhood}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-card border border-border/40 rounded-3xl shadow-sm">
            <div className="p-3 bg-secondary/50 rounded-2xl text-primary">
              <InstagramIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Instagram</p>
              <p className="text-sm font-bold text-foreground">{merchant.instagram}</p>
              <a href={`https://instagram.com/${merchant.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-primary underline mt-1 block">
                Abrir perfil no Instagram
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Primary Action Button */}
      <div className="fixed bottom-8 left-6 right-6 z-50">
        <div className="flex gap-3">
          <Button
            asChild
            variant="whatsapp"
            className="flex-1 h-16 rounded-[1.25rem] text-sm font-black shadow-2xl shadow-whatsapp/30"
          >
            <a href={waUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-6 w-6" />
              Chamar no WhatsApp
            </a>
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="w-16 h-16 rounded-[1.25rem] border-border/60 bg-card p-0"
          >
            <a href={`https://instagram.com/${merchant.instagram.replace('@', '')}`} target="_blank" rel="noreferrer">
              <InstagramIcon className="h-6 w-6 text-foreground" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}