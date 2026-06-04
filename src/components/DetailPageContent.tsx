import { 
  ArrowLeft, 
  MapPin, 
  Instagram as InstagramIcon, 
  Share2, 
  Star,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Tag,
  Navigation,
  TrendingUp,
  Search,
  AlertCircle,
  ShoppingBag,
  Clock,
  Copy
} from "lucide-react";
import { Merchant } from "@/data/merchants";
import { getProductsByMerchant } from "@/data/products";
import { Button } from "@/components/ui/button";
import { PromotionBadge } from "@/components/MerchantCard";
import { TopBar } from "@/components/TopBar";
import { FloatingNav } from "@/components/FloatingNav";
import { useLocation } from "@/hooks/useLocation";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BusinessStatusBadge } from "@/components/BusinessStatusBadge";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingCart } from "@/components/FloatingCart";
import { ReviewSection } from "@/components/ReviewSection";
import { reviewsRepository } from "@/repositories/reviewsRepository";


interface DetailPageContentProps {
  merchant: Merchant;
}

export function DetailPageContent({ merchant }: DetailPageContentProps) {
  const { coords, getDistance, formatDistance } = useLocation();
  const { addItem, merchantId: cartMerchantId, clearCart } = useCart();
  const [coverError, setCoverError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const handleCopy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`, {
      className: "font-black uppercase text-[10px] tracking-widest",
    });
  }, []);

  
  const products = getProductsByMerchant(merchant.id);

  const distance = coords 
    ? getDistance(coords.latitude, coords.longitude, merchant.latitude, merchant.longitude)
    : null;

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${merchant.latitude},${merchant.longitude}`;

  const handleShare = async () => {
    const shareData = {
      title: `${merchant.name} - Axêi no Bairro`,
      text: `Confira este negócio local: ${merchant.name}. Encontre, Conecte, Fortaleça o comércio local!`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("Compartilhado com sucesso!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copiado para a área de transferência!");
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
        toast.error("Erro ao compartilhar. Link copiado como fallback.");
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <TopBar />
      
      <div className="relative w-full max-w-7xl mx-auto md:mt-8 md:px-6">
        <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden md:rounded-3xl shadow-2xl shadow-slate-200 bg-slate-900">
          {!coverError && merchant.image ? (
            <img 
              src={merchant.image} 
              alt={merchant.name} 
              className="w-full h-full object-cover opacity-60"
              onError={() => setCoverError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
              <TrendingUp className="w-16 h-16 opacity-10 mb-4" />
              <span className="text-sm font-black uppercase tracking-[0.2em]">Capa não disponível</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <button 
              onClick={() => window.history.back()}
              className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/30 transition-all active:scale-90"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute top-6 right-6">
            <button 
              onClick={handleShare}
              className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/30 transition-all active:scale-90"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute bottom-8 left-6 right-6 md:left-12 md:right-12">
            <div className="flex items-end gap-6">
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-white p-2 shadow-2xl relative z-10 -mb-12 md:-mb-16 overflow-hidden border-4 border-white">
                  {!logoError && merchant.image ? (
                    <img 
                      src={merchant.image} 
                      alt={merchant.name} 
                      className="w-full h-full object-cover rounded-[1.5rem]"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-orange-600 font-black text-xl">
                      {merchant.name.substring(0, 1)}
                    </div>
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-3 py-1 text-[10px] font-black uppercase text-white shadow-lg">
                      {merchant.category}
                    </span>
                    {merchant.promotion.isActive && <PromotionBadge />}
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                      <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter drop-shadow-lg">
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
                            {(() => {
                              const { average, total } = reviewsRepository.getAverageRating('loja', merchant.id);
                              return total > 0 ? average : 'Novo';
                            })()}
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
                       <WhatsAppButton 
                         merchantId={merchant.id}
                         phone={merchant.whatsapp} 
                         merchantName={merchant.name} 
                         className="h-14 px-8 shadow-xl shadow-emerald-900/20"
                       />
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Sidebar - Moved up on mobile for priority */}
        <div className="order-1 lg:order-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900">Contato Direto</h3>
            
            <div className="pt-2 flex flex-col gap-3 mb-6">
              <WhatsAppButton 
                merchantId={merchant.id}
                phone={merchant.whatsapp} 
                merchantName={merchant.name} 
                className="w-full h-16 text-lg"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl group hover:bg-orange-50 transition-colors cursor-pointer">
                <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Horário de Funcionamento</p>
                  <p className="text-sm font-bold text-slate-900 leading-none">{merchant.hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl group hover:bg-orange-50 transition-colors cursor-pointer">
                <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Endereço</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight flex items-center gap-2">
                    {merchant.address}
                    <button onClick={() => handleCopy(merchant.address, "Endereço")} className="p-1 hover:bg-white rounded shadow-sm text-slate-400 hover:text-orange-600 transition-all">
                      <Copy className="w-3 h-3" />
                    </button>
                  </p>
                  <p className="text-xs font-bold text-orange-600 mt-1">{merchant.neighborhood}</p>
                  <Button asChild variant="link" className="text-orange-600 h-auto p-0 font-bold text-xs mt-2">
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      Ver no mapa / Rota <ChevronRight className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild variant="outline" className="w-full border-slate-200 rounded-2xl h-14 font-black text-slate-700 hover:bg-slate-50">
                <a href={`https://instagram.com/${merchant.instagram.replace('@', '')}`} target="_blank" rel="noreferrer">
                  <InstagramIcon className="w-5 h-5 mr-2" />
                  Instagram
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="order-2 lg:order-1 lg:col-span-2 space-y-8">
          <section id="catalog" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-orange-600" />
                Produtos da Loja
              </h2>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAdd={(p) => {
                      if (cartMerchantId && cartMerchantId !== merchant.id) {
                        if (window.confirm("Seu carrinho possui itens de outra loja. Deseja limpar o carrinho e adicionar este produto?")) {
                          clearCart();
                          addItem(p);
                        }
                      } else {
                        addItem(p);
                      }
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1">Catálogo em breve</h3>
                <p className="text-slate-500 font-medium">Esta loja ainda não cadastrou produtos para venda online.</p>
              </div>
            )}
          </section>

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
                    <BusinessStatusBadge isOpen={merchant.isOpen} hours={merchant.hours} status={merchant.status} />
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
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Avaliações</span>
                 <span className="text-sm font-bold text-slate-900">
                   {reviewsRepository.getAverageRating('loja', merchant.id).total} totais
                 </span>
              </div>
            </div>
          </section>

          <section id="reviews" className="scroll-mt-24">
             <ReviewSection targetId={merchant.id} targetType="loja" />
          </section>
        </div>

        <div className="order-3 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400" />
              Informar um problema
            </h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Viu algo errado? Ajude-nos a manter a vizinhança atualizada informando problemas neste cadastro.
            </p>
            <div className="grid grid-cols-1 gap-2 pt-2">
              {[
                { id: 'wrong_phone', label: 'Telefone incorreto' },
                { id: 'closed_permanently', label: 'Empresa fechada' },
                { id: 'spam', label: 'Spam / Propaganda' },
                { id: 'scam', label: 'Golpe / Fraude' },
                { id: 'other', label: 'Outro motivo' }
              ].map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => {
                    const reports = JSON.parse(localStorage.getItem('axei_reports') || '[]');
                    reports.push({
                      id: `rep-${Date.now()}`,
                      merchantId: merchant.id,
                      merchantName: merchant.name,
                      reasonId: reason.id,
                      reasonLabel: reason.label,
                      timestamp: new Date().toISOString()
                    });
                    localStorage.setItem('axei_reports', JSON.stringify(reports));
                    toast.success("Obrigado! Sua denúncia foi recebida e será analisada.");
                  }}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 transition-colors border border-slate-100"
                >
                  {reason.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-orange-600 rounded-3xl p-8 text-white relative overflow-hidden">
             <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
             <Smartphone className="w-8 h-8 mb-4 opacity-50" />
             <h4 className="text-xl font-black mb-2 tracking-tighter leading-tight">Gostou deste negócio?</h4>
             <p className="text-orange-100 text-sm font-medium mb-6">Compartilhe com seus vizinhos e ajude o comércio local do seu bairro a crescer.</p>
             <Button 
                onClick={handleShare}
                className="w-full bg-white text-orange-600 hover:bg-slate-50 rounded-xl font-bold border-none shadow-xl shadow-orange-900/20"
             >
               Compartilhar agora
             </Button>
          </div>
        </div>
      </main>

      <FloatingCart onClick={() => setIsCartOpen(true)} />
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        merchant={merchant} 
      />
      <FloatingNav />
    </div>
  );
}
