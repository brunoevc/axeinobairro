import { MapPin, Star, Bike, ChevronRight, TrendingUp, Navigation, Tag, ShieldCheck } from "lucide-react";
import type { Merchant } from "@/data/merchants";
import { getMerchantPublicPath } from "@/data/merchants";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { reviewsRepository } from "@/repositories/reviewsRepository";

import { useLocation } from "@/hooks/useLocation";
import { useState, memo, useMemo } from "react";
import { WhatsAppButton } from "./WhatsAppButton";
import { BusinessStatusBadge } from "./BusinessStatusBadge";
import { intentTracker } from "@/utils/intent-tracker";
import { EconomicCategory, Territory } from "@/types/business-intelligence";

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
      className="group flex flex-col h-full overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {!imageError && merchant.image ? (
          <img 
            src={merchant.image} 
            alt={merchant.name}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300 gap-2">
            <TrendingUp className="w-12 h-12 opacity-10" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Axêi no Bairro</span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {merchant.promotion.isActive && <PromotionBadge />}
          {(() => {
            const exposure = (() => {
              if (merchant.exposureLevel === 'A') return { label: 'Patrocinador', color: 'bg-slate-900 text-white border-white/20' };
              if (['igreja', 'escola', 'ong', 'social'].includes(merchant.category.toLowerCase())) return { label: 'Institucional', color: 'bg-blue-600 text-white border-blue-400/30' };
              if (merchant.exposureLevel === 'B') return { label: 'Destaque', color: 'bg-orange-600 text-white border-orange-400/30' };
              if (merchant.exposureLevel === 'C') return { label: 'Premium', color: 'bg-violet-600 text-white border-violet-400/30' };
              return { label: 'Membro', color: 'bg-slate-500 text-white border-slate-300/30' };
            })();
            return (
              <div className={`inline-flex items-center gap-1.5 rounded-full ${exposure.color} px-4 py-2 text-[8px] font-black uppercase tracking-[0.2em] shadow-xl border backdrop-blur-md`}>
                <ShieldCheck className="w-2.5 h-2.5" />
                {exposure.label}
              </div>
            );
          })()}
        </div>

        {merchant.featured && (
           <div className="absolute top-4 right-4 z-10">
             <div className="bg-white/90 backdrop-blur-md text-orange-600 p-2 rounded-full shadow-lg border border-white/20">
                <Star className="w-4 h-4 fill-orange-500" />
             </div>
           </div>
        )}
      </div>

      <div className="flex flex-col p-8 flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-3xl font-black text-slate-900 leading-none tracking-tight group-hover:text-orange-600 transition-colors duration-300">
              {merchant.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-3">
              <MapPin className="h-3 w-3 text-orange-500" />
              <span className="text-xs font-black uppercase text-slate-400 tracking-[0.1em] truncate">
                {merchant.neighborhood}
                {distance !== null && (
                  <span className="inline-flex items-center gap-1 ml-1 pl-1 border-l border-slate-200">
                    <Navigation className="w-2.5 h-2.5" />
                    {formatDistance(distance)}
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-black text-slate-900 border border-slate-100 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
            {(() => {
              const { average, total } = reviewsRepository.getAverageRating('loja', merchant.id);
              return <span>{total > 0 ? average.toFixed(1) : merchant.rating.toFixed(1)}</span>;
            })()}
          </div>
        </div>

        <p className="line-clamp-2 text-base text-slate-500 leading-relaxed mb-8 font-medium">
          {merchant.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-8 mt-auto">
          <BusinessStatusBadge isOpen={merchant.isOpen} hours={merchant.hours} status={merchant.status} />
          {merchant.delivery && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-600 border border-emerald-100">
              <Bike className="h-3 w-3" />
              Delivery
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            asChild
            variant="outline"
            className="rounded-2xl h-14 text-xs font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50 hover:text-orange-600 group/btn transition-all"
          >
            <Link 
              to={getMerchantPublicPath(merchant)}
              onClick={() => {
                intentTracker.track({
                  type: 'view_business',
                  category: merchant.category as EconomicCategory,
                  territory: merchant.neighborhood as Territory,
                  source: 'negocios'
                });
              }}
            >
              Detalhes
              <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
          <WhatsAppButton 
            merchantId={merchant.id}
            phone={merchant.whatsapp} 
            merchantName={merchant.name} 
            className="h-14 rounded-2xl shadow-lg shadow-emerald-500/10 text-xs font-black uppercase tracking-widest"
          />
        </div>
      </div>
    </article>
  );
});
