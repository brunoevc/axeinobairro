import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PixCharge } from "@/types/payment";
import { getPixChargeById } from "@/lib/payments";
import { PixCheckout } from "@/components/PixCheckout";
import { AlertTriangle } from "lucide-react";

export default function CheckoutPix() {
  const { id } = useParams({ from: "/checkout/pix/$id" });
  const [charge, setCharge] = useState<PixCharge | null>(null);

  useEffect(() => {
    if (id) {
      setCharge(getPixChargeById(id) || null);
    }
  }, [id]);

  if (!charge) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black text-slate-900">Cobrança não encontrada</h1>
          <p className="text-slate-500 font-bold">O link que você acessou pode estar expirado ou incorreto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 pb-32">
      <div className="max-w-md mx-auto space-y-6">
        {/* Banner de Aviso Fixo */}
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-[2rem] flex items-center gap-3 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-orange-600 shrink-0" />
          <p className="text-xs text-orange-800 font-black uppercase tracking-tight text-center flex-1">
            Ambiente de simulação.<br/>Nenhum pagamento real será processado.
          </p>
        </div>

        <PixCheckout charge={charge} />
        
        <div className="text-center px-8">
          <p className="text-xs text-slate-400 font-medium">
            Axé Araruama - Sistema de Checkout Simulado.
          </p>
        </div>
      </div>
    </div>
  );
}
