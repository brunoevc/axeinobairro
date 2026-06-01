import { MapPin, Store } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  dark?: boolean;
}

export function Logo({ className, iconOnly = false, dark = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex items-center justify-center shrink-0">
        <MapPin className={cn("w-8 h-8 md:w-9 md:h-9", dark ? "text-slate-900" : "text-orange-600")} strokeWidth={2.5} />
        <div className="absolute inset-0 flex items-center justify-center pt-0.5">
          <Store className={cn("w-3.5 h-3.5 md:w-4 md:h-4", dark ? "text-orange-600" : "text-white")} strokeWidth={3} />
        </div>
      </div>
      
      {!iconOnly && (
        <div className="flex flex-col -space-y-1">
          <span className={cn("text-xl md:text-2xl font-black tracking-tighter leading-none transition-colors", dark ? "text-white" : "text-slate-900")}>
            Axêi no <span className="text-orange-600">Bairro</span>
          </span>
          <span className={cn("text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] leading-none opacity-60", dark ? "text-slate-300" : "text-slate-500")}>
            Encontre. Conecte. Fortaleça.
          </span>
        </div>
      )}
    </div>
  );
}
