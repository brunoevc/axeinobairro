import { MapPin, Star, Bike, ChevronRight, TrendingUp, Navigation, Tag } from "lucide-react";
import type { Merchant } from "@/data/merchants";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useLocation } from "@/hooks/useLocation";
import { useState, memo } from "react";
import { WhatsAppButton } from "./WhatsAppButton";
import { BusinessStatusBadge } from "./BusinessStatusBadge";

type Props = { merchant: Merchant };


export function PromotionBadge() {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
      <Tag className="h-3 w-3" />
      Promoção
    </div>
  );
}

export const MerchantCard = memo(function MerchantCard({ merchant }: Props) {
  const { coords, getDistance, formatDistance } = useLocation();
  const [imageError, setImageError] = useState(false);

  // WhatsApp and status logic removed in favor of dedicated components



  const distance = coords 
    ? getDistance(coords.latitude, coords.longitude, merchant.latitude, merchant.longitude)
    : null;

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {!imageError && merchant.image ? (
          <img 
            src={merchant.image} 
            alt={merchant.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300 gap-2">
            <TrendingUp className="w-10 h-10 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest">Imagem não disponível</span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {merchant.promotion.isActive && <PromotionBadge />}
          <div className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold uppercase text-slate-900 shadow-sm border border-slate-200/50">
            {merchant.category}
          </div>
        </div>
        
        {merchant.featured && (
           <div className="absolute top-4 right-4 z-10">
             <div className="bg-violet-600 text-white p-1.5 rounded-full shadow-lg">
                <Star className="w-3.5 h-3.5 fill-white" />
             </div>
           </div>
        )}
      </div>

      <div className="flex flex-col p-5 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-black text-slate-900 leading-tight">
              {merchant.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-orange-500" />
              <span className="text-xs font-bold text-slate-500 truncate">
                {merchant.neighborhood}
                {distance !== null && (
                  <span className="flex items-center gap-1 ml-1 pl-1 border-l border-slate-200">
                    <Navigation className="w-2.5 h-2.5" />
                    {formatDistance(distance)}
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-xs font-bold text-slate-900 border border-slate-100">
            <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
            {merchant.rating.toFixed(1)}
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-slate-500 leading-relaxed mb-4 min-h-[2.5rem]">
          {merchant.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-6 mt-auto">
          <BusinessStatusBadge isOpen={merchant.isOpen} hours={merchant.hours} status={merchant.status} />


          {merchant.delivery && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600 border border-blue-100">
              <Bike className="h-3 w-3" />
              Entrega disponível
            </span>
          )}
          {merchant.id === "1" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-orange-600 border border-orange-100">
              <Star className="h-3 w-3 fill-orange-500" />
              Perto de você
            </span>
          )}
          {merchant.id === "2" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-600 border border-violet-100">
              <TrendingUp className="h-3 w-3" />
              Popular hoje
            </span>
          )}
          {merchant.neighborhood === "Centro" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500 border border-slate-200">
              <MapPin className="h-3 w-3" />
              No Centro de Araruama
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            className="flex-1 rounded-xl h-11 text-xs font-bold border-slate-200 hover:bg-slate-50 hover:text-orange-600 group/btn"
          >
            <Link to="/negocios/$id" params={{ id: merchant.id }}>
              Ver Detalhes
              <ChevronRight className="w-3 h-3 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
          <WhatsAppButton 
            merchantId={merchant.id}
            phone={merchant.whatsapp} 

            merchantName={merchant.name} 
            className="flex-1"
          />


        </div>
      </div>
    </article>
  );
});
