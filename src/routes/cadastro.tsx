import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Store, 
  Image as ImageIcon, 
  Tag, 
  Clock, 
  MapPin, 
  Instagram, 
  MessageCircle,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { categories, neighborhoods } from "@/data/merchants";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cadastro")({
  component: RegistrationPage,
});

function RegistrationPage() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    neighborhood: "",
    address: "",
    whatsapp: "",
    instagram: "",
    description: "",
    hours: "",
    image: "",
    promoTitle: "",
    promoDesc: "",
    promoActive: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to Supabase
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-whatsapp/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle2 className="h-12 w-12 text-whatsapp" />
        </div>
        <h1 className="text-3xl font-black text-foreground mb-4 leading-tight">
          Quase lá! <br /> <span className="text-primary">Sua loja está na fila.</span>
        </h1>
        <p className="text-muted-foreground mb-10 max-w-xs leading-relaxed font-medium">
          Seu negócio foi cadastrado para análise. Em breve ele estará visível para todos no bairro.
        </p>
        <div className="flex flex-col w-full gap-4">
          <Button onClick={() => navigate({ to: '/' })} className="rounded-[1.25rem] h-16 text-sm font-black shadow-xl shadow-primary/20">
            Voltar para o Início
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: '/admin/lojas' })} className="rounded-[1.25rem] h-16 text-sm font-black border-border/60">
            Ver minhas lojas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="px-6 pt-12 pb-8 bg-card border-b border-border/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
        <button 
          onClick={() => navigate({ to: "/" })}
          className="mb-6 p-3 bg-secondary/50 rounded-full border border-border/40 active:scale-90 transition-all inline-flex"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-foreground leading-tight">
            Anuncie no <br /><span className="text-primary">Axêi no Bairro</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-2 max-w-xs leading-relaxed">
            Comece a atrair mais clientes do seu bairro hoje mesmo de forma simples.
          </p>
        </div>
      </header>

      <main className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sessão 1: Básico */}
          <section className="space-y-5">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2 flex items-center gap-2">
              <Store className="h-4 w-4" />
              Informações da Loja
            </h2>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Nome do Negócio</label>
              <input 
                required
                type="text" 
                placeholder="Ex: Cantina da Nonna"
                className="w-full bg-card border border-border/60 rounded-2xl p-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Categoria</label>
                <select 
                  required
                  className="w-full bg-card border border-border/60 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Selecionar</option>
                  {categories.map(cat => <option key={cat.slug} value={cat.slug}>{cat.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Bairro</label>
                <select 
                  required
                  className="w-full bg-card border border-border/60 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all appearance-none"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                >
                  <option value="">Selecionar</option>
                  {neighborhoods.map(hood => <option key={hood} value={hood}>{hood}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Endereço Completo</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                <input 
                  required
                  type="text" 
                  placeholder="Rua, Número, Referência"
                  className="w-full bg-card border border-border/60 rounded-2xl p-4 pl-11 text-sm outline-none focus:border-primary transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Sessão 2: Contato */}
          <section className="space-y-5 pt-4 border-t border-border/40">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contato e Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">WhatsApp (com DDD)</label>
                <input 
                  required
                  type="tel" 
                  placeholder="11999990000"
                  className="w-full bg-card border border-border/60 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Instagram (@usuario)</label>
                <div className="relative">
                  <Instagram className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="@seunegocio"
                    className="w-full bg-card border border-border/60 rounded-2xl p-4 pl-11 text-sm outline-none focus:border-primary transition-all"
                    value={formData.instagram}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sessão 3: Detalhes */}
          <section className="space-y-5 pt-4 border-t border-border/40">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Descrição e Foto
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Descrição Curta</label>
              <textarea 
                required
                placeholder="Conte o que sua loja oferece em poucas palavras..."
                className="w-full bg-card border border-border/60 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all h-32 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">Horário (Ex: 08:00 - 18:00)</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                  <input 
                    required
                    type="text" 
                    placeholder="Segunda a Sábado..."
                    className="w-full bg-card border border-border/60 rounded-2xl p-4 pl-11 text-sm outline-none focus:border-primary transition-all"
                    value={formData.hours}
                    onChange={(e) => setFormData({...formData, hours: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">URL da Imagem de Capa</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="url" 
                    placeholder="https://exemplo.com/foto.jpg"
                    className="w-full bg-card border border-border/60 rounded-2xl p-4 pl-11 text-sm outline-none focus:border-primary transition-all"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sessão 4: Promoção */}
          <section className="space-y-5 pt-4 border-t border-border/40 p-6 bg-primary/5 rounded-[2rem] border-dashed border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Promoção (Opcional)
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Ativar?</span>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-primary rounded-md"
                  checked={formData.promoActive}
                  onChange={(e) => setFormData({...formData, promoActive: e.target.checked})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1 opacity-80">Título da Oferta</label>
                <input 
                  type="text" 
                  placeholder="Ex: 20% de Desconto em Pizzas"
                  className="w-full bg-card border border-border/60 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all disabled:opacity-50"
                  disabled={!formData.promoActive}
                  value={formData.promoTitle}
                  onChange={(e) => setFormData({...formData, promoTitle: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1 opacity-80">Descrição da Oferta</label>
                <input 
                  type="text" 
                  placeholder="Explique como funciona a promoção..."
                  className="w-full bg-card border border-border/60 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all disabled:opacity-50"
                  disabled={!formData.promoActive}
                  value={formData.promoDesc}
                  onChange={(e) => setFormData({...formData, promoDesc: e.target.value})}
                />
              </div>
            </div>
          </section>

          <Button 
            type="submit" 
            className="w-full h-16 rounded-[1.5rem] text-sm font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Cadastrar meu Negócio
          </Button>
        </form>
      </main>
    </div>
  );
}