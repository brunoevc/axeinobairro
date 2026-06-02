import { MessageCircle, Clock, MapPin } from "lucide-react";
import { cn, getWhatsAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  phone: string;
  merchantName: string;
  className?: string;
  variant?: "outline" | "default" | "ghost" | "link";
  text?: string;
}

export function WhatsAppButton({ 
  phone, 
  merchantName, 
  className, 
  variant = "default",
  text = "Chamar no WhatsApp" 
}: WhatsAppButtonProps) {
  const waUrl = getWhatsAppUrl(phone, merchantName);

  if (!waUrl) {
    return (
      <div className={cn("text-center py-2 text-xs font-bold text-slate-400 bg-slate-100 rounded-xl", className)}>
        WhatsApp indisponível
      </div>
    );
  }

  return (
    <Button
      asChild
      variant={variant}
      className={cn(
        "rounded-xl h-11 text-xs font-bold transition-all",
        variant === "default" && "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100",
        className
      )}
    >
      <a href={waUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-4 w-4 mr-1.5" />
        {text}
      </a>
    </Button>
  );
}
