
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Plus, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/metrics";


interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  disabled?: boolean;
}

export function ProductCard({ product, onAdd, disabled }: ProductCardProps) {
  return (
    <div className={cn(
      "group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-md flex flex-col h-full",
      !product.isAvailable && "opacity-60 grayscale"
    )}>
      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isPromotion && (
          <div className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Tag className="w-3 h-3" />
            OFERTA
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black text-slate-900 uppercase">
              Indisponível
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{product.category}</span>
          <h3 className="text-sm font-black text-slate-900 line-clamp-1 mt-0.5">{product.name}</h3>
          <p className="text-xs font-medium text-slate-500 line-clamp-2 mt-1 h-8 leading-snug">
            {product.description}
          </p>
        </div>
        
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 tracking-tighter">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          
          <Button 
            size="sm"
            onClick={() => {
              onAdd(product);
              trackEvent(product.merchantId, "promocao"); // Tracking as a general interest/promotion click
            }}

            disabled={!product.isAvailable || disabled}
            className="rounded-xl h-10 px-4 bg-orange-600 hover:bg-orange-700 text-white font-black shadow-lg shadow-orange-100 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}
