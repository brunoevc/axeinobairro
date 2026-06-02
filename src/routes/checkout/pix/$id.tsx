import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PixCharge, PixLink, PixPurpose } from "@/types/payment";
import { getPixChargeById, getPixLinkById, createPixCharge } from "@/lib/payments";
import { PixCheckout } from "@/components/PixCheckout";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CheckoutPix() {
  const { id } = useParams({ from: "/checkout/pix/$id" });
  const [charge, setCharge] = useState<PixCharge | null>(null);
  const [pixLink, setPixLink] = useState<PixLink | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<PixPurpose | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const fetchData = () => {
    if (!id) return;
    const existingCharge = getPixChargeById(id);
    if (existingCharge) {
      setCharge(existingCharge);
      setPixLink(null);
    } else {
      const link = getPixLinkById(id);
      if (link) {
        setPixLink(link);
        setCharge(null);
      }
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handlePurposeSelect = (purpose: PixPurpose) => {
    if (purpose.fixedAmount) {
      const newCharge = createPixCharge({
        merchantId: pixLink!.merchantId,
        merchantName: pixLink!.merchantName,
        amount: purpose.fixedAmount,
        customerName: "Cliente via Link",
        status: "aguardando_pagamento",
        linkId: pixLink!.id,
        purposeName: purpose.name
      });
      setCharge(newCharge);
    } else {
      setSelectedPurpose(purpose);
    }
  };

  const handleCustomAmountPay = () => {
    const amount = parseFloat(customAmount);
    if (!amount || amount <= 0) {
      toast.error("Informe um valor maior que zero");
      return;
    }
    const newCharge = createPixCharge({
      merchantId: pixLink!.merchantId,
      merchantName: pixLink!.merchantName,
      amount,
      customerName: "Cliente via Link",
      status: "aguardando_pagamento",
      linkId: pixLink!.id,
      purposeName: selectedPurpose!.name
    });
    setCharge(newCharge);
  };

  if (!charge && !pixLink) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-black">Cobrança não encontrada</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 pb-32">
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-[2rem] text-center shadow-sm">
           <p className="text-[10px] text-orange-800 font-black uppercase tracking-tight">Ambiente de simulação. Nenhum pagamento real será processado.</p>
        </div>

        {pixLink && !charge && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900">{pixLink.title}</h2>
              <p className="text-slate-500 font-bold">{pixLink.merchantName}</p>
            </div>
            {!selectedPurpose ? (
              <div className="space-y-3">
                <p className="text-[10px] text-slate-400 font-black uppercase text-center tracking-widest">Selecione uma finalidade</p>
                {pixLink.purposes.map(p => (
                  <Button key={p.id} onClick={() => handlePurposeSelect(p)} className="w-full h-14 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold rounded-2xl border border-slate-200 flex justify-between px-6 shadow-none">
                    <span>{p.name}</span>
                    <span className="text-orange-600 font-black">{p.fixedAmount ? `R$ ${p.fixedAmount.toFixed(2)}` : "Valor Livre"}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center font-bold">{selectedPurpose.name}</p>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                  <Input type="number" placeholder="0.00" value={customAmount} onChange={e => setCustomAmount(e.target.value)} className="h-14 pl-12 rounded-2xl font-black text-lg" />
                </div>
                <Button onClick={handleCustomAmountPay} className="w-full h-14 bg-slate-900 font-black rounded-2xl text-white">Pagar com Pix</Button>
                <Button variant="ghost" onClick={() => setSelectedPurpose(null)} className="w-full">Voltar</Button>
              </div>
            )}
          </div>
        )}

        {charge && <PixCheckout charge={charge} onStatusUpdate={fetchData} />}
      </div>
    </div>
  );
}