import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2, Clock, XCircle, AlertCircle, FileCheck, Send } from "lucide-react";
import { PixCharge } from "@/types/payment";
import { updatePixStatus } from "@/lib/payments";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  charge: PixCharge;
  onStatusUpdate?: () => void;
}

export function PixCheckout({ charge, onStatusUpdate }: Props) {
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(charge.pixKey);
    setCopied(true);
    toast.success("Chave Pix copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSending(true);
    setTimeout(() => {
      updatePixStatus(charge.id, "comprovante_enviado", file.name);
      toast.success("Comprovante enviado para análise!");
      setIsSending(false);
      onStatusUpdate?.();
    }, 1500);
  };

  const statusConfig = {
    aguardando_pagamento: { color: "bg-orange-50 text-orange-700", icon: Clock, label: "Aguardando Pagamento" },
    comprovante_enviado: { color: "bg-blue-50 text-blue-700", icon: FileCheck, label: "Aguardando Conferência" },
    aprovado: { color: "bg-green-50 text-green-700", icon: CheckCircle2, label: "Pagamento Aprovado" },
    recusado: { color: "bg-red-50 text-red-700", icon: XCircle, label: "Pagamento Recusado" },
    cancelado: { color: "bg-slate-50 text-slate-700", icon: AlertCircle, label: "Cobrança Cancelada" },
  };

  const config = statusConfig[charge.status];

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden max-w-md mx-auto">
      <div className={`p-6 flex flex-col items-center text-center ${config.color} border-b border-slate-100`}>
        <config.icon className="w-10 h-10 mb-2" />
        <h2 className="text-lg font-black uppercase tracking-tight">{config.label}</h2>
      </div>
      
      <CardContent className="p-8 space-y-6">
        <div className="text-center">
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">{charge.merchantName}</p>
          <div className="text-4xl font-black text-slate-900">
            R$ {charge.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
        </div>

        {charge.status === "aguardando_pagamento" && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
              <div className="w-40 h-40 bg-white p-4 rounded-xl relative flex items-center justify-center border border-slate-100 shadow-inner opacity-40">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-300" fill="currentColor">
                  <path d="M0 0h40v40H0zM60 0h40v40H60zM0 60h40v40H0zM60 60h10v10H60zM70 70h10v10H70zM80 60h10v10H80zM90 70h10v10H90zM60 80h10v10H60zM80 80h10v10H80zM70 90h10v10H70zM90 90h10v10H90z" />
                  <path d="M10 10h20v20H10zM70 10h20v20H70zM10 70h20v20H10z" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4">
                   <span className="text-slate-500 font-black text-[8px] uppercase text-center leading-none">
                      QR CODE SIMULADO
                    </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] text-slate-400 font-black text-center uppercase tracking-widest">Pague Manualmente via Pix</p>
              <div className="flex gap-2">
                <div className="bg-slate-50 p-4 rounded-2xl flex-1 truncate text-xs font-mono text-slate-500 border border-slate-100">
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

            <div className="relative">
              <input
                type="file"
                id="receipt-upload"
                className="hidden"
                accept="image/*,application/pdf"
                onChange={handleSendReceipt}
                disabled={isSending}
              />
              <Button 
                asChild
                disabled={isSending}
                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <label htmlFor="receipt-upload">
                  {isSending ? "Enviando..." : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Comprovante
                    </>
                  )}
                </label>
              </Button>
            </div>
          </div>
        )}

        {charge.status === "comprovante_enviado" && (
          <div className="py-8 text-center space-y-4">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto border border-blue-100">
              <FileCheck className="w-10 h-10 text-blue-600" />
            </div>
            <div className="space-y-2">
              <p className="text-slate-900 font-black text-sm uppercase">Comprovante Recebido</p>
              <p className="text-slate-500 text-xs font-bold">Aguardando conferência manual do lojista para liberar o pedido.</p>
            </div>
          </div>
        )}

        {charge.status === "aprovado" && (
          <div className="py-8 text-center space-y-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-900 font-black text-sm uppercase">Pedido Confirmado</p>
              <p className="text-slate-500 text-xs font-bold">Seu pagamento foi aprovado pelo lojista.</p>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-black uppercase text-center leading-relaxed tracking-tighter">
            AMBIENTE DE SIMULAÇÃO.<br/>NENHUM PAGAMENTO REAL SERÁ PROCESSADO.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
