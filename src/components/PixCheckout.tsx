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
              {/* QR Code Placeholder - Mock visual */}
              <div className="w-48 h-48 bg-white p-2 rounded-xl relative">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AXEI_SIMULADO_MOCK_PAYMENT" 
                  alt="QR Code Mock" 
                  className="w-full h-full opacity-50 grayscale"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-orange-200 text-orange-600 font-black px-4 py-2 text-[10px] uppercase shadow-lg">
                    Simulado
                  </Badge>
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
