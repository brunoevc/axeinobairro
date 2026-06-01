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
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Tag
} from "lucide-react";
import { merchants } from "@/data/merchants";
import { Button } from "@/components/ui/button";
import { PromotionBadge } from "@/components/MerchantCard";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { useLocation } from "@/hooks/useLocation";

export const Route = createFileRoute("/negocios/$id")({
  component: DetailPage,
});

function DetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const merchant = merchants.find((m) => m.id === id);

  if (!merchant) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Negócio não encontrado</h1>
        <p className="text-slate-500 mb-8 max-w-xs leading-relaxed">
          O estabelecimento que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={() => navigate({ to: '/negocios' })} className="bg-orange-600 hover:bg-orange-700 rounded-2xl h-14 px-8 font-bold text-white shadow-lg shadow-orange-200 transition-all active:scale-95">
          Voltar para a lista
        </Button>
      </div>
    );
  }

  const waUrl = `https://wa.me/${merchant.whatsapp}?text=${encodeURIComponent(
    `Olá ${merchant.name}! Vi seu perfil no Axêi no Bairro e gostaria de mais informações 👋`
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <TopBar />
      
      {/* Hero Section */}
      <div className="relative w-full max-w-7xl mx-auto md:mt-8 md:px-6">
        <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden md:rounded-3xl shadow-2xl shadow-slate-200">
          <img 
            src={merchant.image} 
            alt={merchant.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Top Actions */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <button 
              onClick={() => window.history.back()}
              className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/30 transition-all active:scale-90"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute top-6 right-6">
            <button className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/30 transition-all active:scale-90">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Business Core Info Overlay */}
          <div className="absolute bottom-8 left-6 right-6 md:left-12 md:right-12">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-3 py-1 text-[10px] font-black uppercase text-white shadow-lg">
                  {merchant.category}
                </span>
                {merchant.promotion.isActive && <PromotionBadge />}
                {merchant.featured && (
                   <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black uppercase text-slate-900 shadow-lg">
                     Destaque
                   </span>
                )}
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                    {merchant.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-white/90 text-sm font-bold">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-orange-400" />
                      {merchant.neighborhood}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-white/20">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {merchant.rating.toFixed(1)}
                      </div>
                      {distance !== null && (
                        <div className="flex items-center gap-1 bg-orange-600 px-2 py-0.5 rounded-lg shadow-lg">
                           <Navigation className="w-3 h-3 text-white" />
                           <span className="text-white text-[10px] font-black uppercase">{formatDistance(distance)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex gap-4">
                   <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-emerald-900/20">
                     <a href={waUrl} target="_blank" rel="noopener noreferrer">
                       <MessageCircle className="w-5 h-5 mr-2" />
                       Chamar no WhatsApp
                     </a>
                   </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Promotion Highlight */}
          {merchant.promotion.isActive && (
            <section className="bg-orange-50 border border-orange-100 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-100/50 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500 rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-4">
                  <Tag className="w-3 h-3" />
                  Oferta do Bairro
                </div>
                <p className="text-2xl font-black text-slate-900 mb-2">{merchant.promotion.title}</p>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {merchant.promotion.description}
                </p>
              </div>
            </section>
          )}

          {/* About */}
          <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-orange-600" />
              Sobre o negócio
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              {merchant.description}
            </p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                 <div className="flex items-center gap-1.5">
                   <span className={`w-2 h-2 rounded-full ${merchant.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                   <span className="text-sm font-bold text-slate-900">{merchant.isOpen ? 'Aberto' : 'Fechado'}</span>
                 </div>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Entrega</span>
                 <span className="text-sm font-bold text-slate-900">{merchant.delivery ? 'Sim' : 'Não'}</span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Preço</span>
                 <span className="text-sm font-bold text-slate-900">$$$</span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-bold text-slate-400 uppercase">No App desde</span>
                 <span className="text-sm font-bold text-slate-900">Maio 2026</span>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900">Informações de Contato</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl group hover:bg-orange-50 transition-colors cursor-pointer">
                <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Horário</p>
                  <p className="text-sm font-bold text-slate-900 leading-none">{merchant.hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl group hover:bg-orange-50 transition-colors cursor-pointer">
                <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Endereço</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{merchant.address}</p>
                  <p className="text-xs font-bold text-orange-600 mt-1">{merchant.neighborhood}</p>
                  <Button asChild variant="link" className="text-orange-600 h-auto p-0 font-bold text-xs mt-2">
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      Ver no mapa / Rota <ChevronRight className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl group hover:bg-orange-50 transition-colors cursor-pointer">
                <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <InstagramIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Instagram</p>
                  <p className="text-sm font-bold text-slate-900 leading-none">{merchant.instagram}</p>
                  <a href={`https://instagram.com/${merchant.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-orange-600 mt-1 inline-flex items-center gap-1">
                    Ver perfil <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 font-black shadow-lg shadow-emerald-100">
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Enviar Mensagem
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full border-slate-200 rounded-2xl h-14 font-black text-slate-700 hover:bg-slate-50">
                <a href={`https://instagram.com/${merchant.instagram.replace('@', '')}`} target="_blank" rel="noreferrer">
                  <InstagramIcon className="w-5 h-5 mr-2" />
                  Seguir no Instagram
                </a>
              </Button>
            </div>
          </div>

          <div className="bg-orange-600 rounded-3xl p-8 text-white relative overflow-hidden">
             <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
             <Smartphone className="w-8 h-8 mb-4 opacity-50" />
             <h4 className="text-xl font-black mb-2 tracking-tighter leading-tight">Gostou deste negócio?</h4>
             <p className="text-orange-100 text-sm font-medium mb-6">Compartilhe com seus vizinhos e ajude o comércio local do seu bairro a crescer.</p>
             <Button className="w-full bg-white text-orange-600 hover:bg-slate-50 rounded-xl font-bold border-none shadow-xl shadow-orange-900/20">
               Compartilhar agora
             </Button>
          </div>
        </div>
      </main>

      <FloatingNav />
    </div>
  );
}
