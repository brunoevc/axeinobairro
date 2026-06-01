import { MapPin, Store } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  dark?: boolean;
}

export function Logo({ className, iconOnly = false, dark = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center shrink-0">
        <MapPin className={cn("w-7 h-7 md:w-8 md:h-8", dark ? "text-slate-900" : "text-orange-600")} strokeWidth={2.5} />
        <div className="absolute inset-0 flex items-center justify-center pt-0.5">
          <Store className={cn("w-3 h-3 md:w-3.5 md:h-3.5", dark ? "text-orange-600" : "text-white")} strokeWidth={3} />
        </div>
      </div>
      
      {!iconOnly && (
        <div className="flex flex-col -space-y-0.5">
          <span className={cn("text-lg md:text-xl font-black tracking-tighter leading-none transition-colors", dark ? "text-white" : "text-slate-900")}>
            Axêi no <span className="text-orange-600">Bairro</span>
          </span>
          {/* Internal slogan removed from TopBar for clarity as requested */}
        </div>
      )}
    </div>
  );
}
