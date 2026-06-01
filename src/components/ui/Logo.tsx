import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  dark?: boolean;
}

export function Logo({ className, iconOnly = false, dark = false }: LogoProps) {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem("platform_logo_url");
    if (savedLogo) {
      setCustomLogoUrl(savedLogo);
    }
  }, []);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {customLogoUrl ? (
        <img 
          src={customLogoUrl} 
          alt="Axêi no Bairro" 
          className="h-8 md:h-10 w-auto object-contain"
          onError={() => setCustomLogoUrl(null)}
        />
      ) : (
        <div className="flex flex-col -space-y-0.5">
          <span className={cn(
            "text-xl md:text-2xl font-black tracking-tighter leading-none transition-colors", 
            dark ? "text-white" : "text-slate-900"
          )}>
            Axêi no <span className="text-orange-600">Bairro</span>
          </span>
        </div>
      )}
    </div>
  );
}
