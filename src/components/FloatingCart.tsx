
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingCartProps {
  onClick: () => void;
  className?: string;
}

export function FloatingCart({ onClick, className }: FloatingCartProps) {
  const { getItemsCount, getTotal } = useCart();
  const count = getItemsCount();
  const total = getTotal();

  if (count === 0) return null;

  return (
    <div className={cn(
      "fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm transition-all animate-in fade-in slide-in-from-bottom-4 duration-500",
      className
    )}>
      <Button 
        onClick={onClick}
        className="w-full h-16 bg-slate-900 hover:bg-black text-white rounded-2xl shadow-2xl flex items-center justify-between px-6 border border-white/10 group active:scale-95 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 group-hover:scale-110 transition-transform">
              {count}
            </span>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">Ver Carrinho</p>
            <p className="text-sm font-black text-white">Seu Pedido</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">Subtotal</p>
          <p className="text-lg font-black text-orange-400 tracking-tighter">
            R$ {total.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </Button>
    </div>
  );
}
