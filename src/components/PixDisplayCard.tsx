import { PixConfig } from "@/types/users";
import { Button } from "@/components/ui/button";
import { Copy, Wallet, Info } from "lucide-react";
import { copyPixKey, formatPixKeyLabel } from "@/lib/pix";

interface PixDisplayCardProps {
  pixConfig?: PixConfig;
  className?: string;
}

export function PixDisplayCard({ pixConfig, className = "" }: PixDisplayCardProps) {
  if (!pixConfig || !pixConfig.enabled || !pixConfig.key) return null;

  return (
    <div className={`bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 md:p-8 space-y-6 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-emerald-900 tracking-tight">Contribuir via Pix</h3>
          <p className="text-emerald-700/70 text-sm font-medium">Pagamento direto ao responsável</p>
        </div>
      </div>

      <div className="bg-white/60 rounded-2xl p-5 border border-white space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-black text-emerald-800/40 uppercase tracking-widest mb-1">Titular</p>
            <p className="text-sm font-bold text-emerald-900">{pixConfig.holderName}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-800/40 uppercase tracking-widest mb-1">Tipo de Chave</p>
            <p className="text-sm font-bold text-emerald-900">{formatPixKeyLabel(pixConfig.keyType)}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-emerald-100">
          <p className="text-[10px] font-black text-emerald-800/40 uppercase tracking-widest mb-2">Chave Pix</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-emerald-100/50 p-3 rounded-xl text-emerald-900 font-mono text-xs break-all border border-emerald-100">
              {pixConfig.key}
            </code>
            <Button 
              size="icon"
              variant="ghost"
              onClick={() => copyPixKey(pixConfig.key)}
              className="h-10 w-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shrink-0 transition-all hover:scale-105"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {pixConfig.description && (
          <div className="pt-2">
             <p className="text-[10px] font-medium text-emerald-700/60 italic">{pixConfig.description}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 items-start opacity-70">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-[10px] font-medium text-emerald-800 leading-relaxed uppercase tracking-wider">
          O pagamento é feito diretamente entre você e o responsável. O Axêi no Bairro não processa, intermedeia ou garante pagamentos.
        </p>
      </div>
    </div>
  );
}
