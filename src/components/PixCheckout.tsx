import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { PixCharge } from "@/types/payment";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  charge: PixCharge;
}

export function PixCheckout({ charge }: Props) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(charge.pixKey);
    setCopied(true);
    toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const statusConfig = {
    pendente: { color: "bg-orange-100 text-orange-700", icon: Clock, label: "Aguardando Pagamento" },
    pago: { color: "bg-green-100 text-green-700", icon: CheckCircle2, label: "Pagamento Confirmado" },
    expirado: { color: "bg-slate-100 text-slate-700", icon: AlertCircle, label: "Cobrança Expirada" },
    cancelado: { color: "bg-red-100 text-red-700", icon: XCircle, label: "Cobrança Cancelada" },
  };

  const config = statusConfig[charge.status];

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden max-w-md mx-auto">
      <div className={`p-6 flex flex-col items-center text-center ${config.color} border-b`}>
        <config.icon className="w-12 h-12 mb-2" />
        <h2 className="text-xl font-black uppercase tracking-tight">{config.label}</h2>
      </div>
      
      <CardContent className="p-8 space-y-6">
        <div className="text-center">
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-1">{charge.merchantName}</p>
          <div className="text-4xl font-black text-slate-900">
            R$ {charge.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
        </div>

        {charge.status === "pendente" && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
              {/* QR Code Mock local via SVG inline - Sem requisição externa */}
              <div className="w-48 h-48 bg-white p-4 rounded-xl relative flex items-center justify-center border border-slate-100 shadow-inner">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-slate-200 opacity-50"
                  fill="currentColor"
                >
                  <path d="M0 0h40v40H0zM60 0h40v40H60zM0 60h40v40H0zM60 60h10v10H60zM70 70h10v10H70zM80 60h10v10H80zM90 70h10v10H90zM60 80h10v10H60zM80 80h10v10H80zM70 90h10v10H70zM90 90h10v10H90z" />
                  <path d="M10 10h20v20H10zM70 10h20v20H70zM10 70h20v20H10z" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4">
                  <div className="bg-white/95 backdrop-blur-sm border border-orange-200 p-3 rounded-2xl shadow-xl flex flex-col items-center gap-1">
                    <span className="text-orange-600 font-black text-[10px] uppercase tracking-tighter text-center">
                      QR CODE SIMULADO
                    </span>
                    <span className="text-slate-400 font-bold text-[8px] uppercase text-center leading-none">
                      Ambiente de Teste
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-bold text-center uppercase tracking-wider">Pix Copia e Cola</p>
              <div className="flex gap-2">
                <div className="bg-slate-100 p-4 rounded-2xl flex-1 truncate text-xs font-mono text-slate-500 border border-slate-200">
                  {charge.pixKey}
                </div>
                <Button 
                  onClick={copyToClipboard}
                  size="icon"
                  className="h-12 w-12 rounded-2xl bg-orange-600 hover:bg-orange-700 shrink-0 shadow-lg shadow-orange-100"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {charge.status === "pago" && (
          <div className="py-8 text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-slate-600 font-medium">Obrigado! Seu pagamento simulado foi processado com sucesso.</p>
          </div>
        )}

        <div className="pt-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase text-center leading-relaxed">
            Esta é uma demonstração do Axé Araruama.<br/>
            Nenhuma cobrança real foi realizada.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
