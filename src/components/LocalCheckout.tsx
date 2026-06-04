import React, { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { Merchant } from "@/data/merchants";
import { deliveryRepository } from "@/repositories/deliveryRepository";
import { DeliveryZone } from "@/types/delivery";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Truck, ShoppingBag, Clock, Info, Copy, CheckCircle2, MessageCircle } from "lucide-react";
import { cn, getOrderWhatsAppUrl } from "@/lib/utils";
import { toast } from "sonner";
import { trackEvent } from "@/lib/metrics";

interface LocalCheckoutProps {
  merchant: Merchant;
  onSuccess?: () => void;
}

export function LocalCheckout({ merchant, onSuccess }: LocalCheckoutProps) {
  const { items, getTotal, notes, setNotes, checkoutData, setCheckoutData } = useCart();
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);

  useEffect(() => {
    const merchantZones = deliveryRepository.getByMerchant(merchant.id).filter(z => z.isActive);
    setZones(merchantZones);
    
    // If delivery is selected but no zone is picked, try to find current one
    if (checkoutData.orderType === 'entrega' && checkoutData.neighborhoodId) {
      const current = merchantZones.find(z => z.id === checkoutData.neighborhoodId);
      if (current) setSelectedZone(current);
    }
  }, [merchant.id, checkoutData.orderType, checkoutData.neighborhoodId]);

  const subtotal = getTotal();
  const deliveryFee = checkoutData.orderType === 'entrega' ? (selectedZone?.deliveryFee || 0) : 0;
  const total = subtotal + deliveryFee;

  const handleZoneSelect = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    if (zone) {
      setSelectedZone(zone);
      setCheckoutData({ 
        neighborhood: zone.neighborhood, 
        neighborhoodId: zone.id,
        deliveryFee: zone.deliveryFee 
      });
    }
  };

  const handleCopyPix = () => {
    if (merchant.pixConfig?.key) {
      navigator.clipboard.writeText(merchant.pixConfig.key);
      toast.success("Chave Pix copiada!");
    }
  };

  const isFormValid = () => {
    if (!checkoutData.customerName || !checkoutData.customerPhone) return false;
    if (checkoutData.orderType === 'entrega') {
      if (!selectedZone || !checkoutData.address) return false;
      if (selectedZone.minimumOrder && subtotal < selectedZone.minimumOrder) return false;
    }
    return true;
  };

  const handleSendOrder = () => {
    if (!isFormValid()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    trackEvent(merchant.id, "pedido_whatsapp", { 
      total,
      checkoutData 
    } as any);

    const url = getOrderWhatsAppUrl(merchant, items, notes, checkoutData);
    if (url) {
      window.open(url, '_blank');
      toast.success("Pedido pronto no WhatsApp!");
      onSuccess?.();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Tipo de Pedido */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <Truck className="w-4 h-4 text-orange-600" />
          Como deseja receber?
        </h3>
        <RadioGroup 
          value={checkoutData.orderType} 
          onValueChange={(v) => setCheckoutData({ orderType: v as any, deliveryFee: v === 'retirada' ? 0 : checkoutData.deliveryFee })}
          className="flex gap-4"
        >
          <div className="flex-1">
            <RadioGroupItem value="retirada" id="retirada" className="peer sr-only" />
            <Label
              htmlFor="retirada"
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50/50 cursor-pointer transition-all"
            >
              <span className="text-sm font-black text-slate-900">Retirada</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Vou buscar</span>
            </Label>
          </div>
          <div className="flex-1">
            <RadioGroupItem value="entrega" id="entrega" className="peer sr-only" />
            <Label
              htmlFor="entrega"
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50/50 cursor-pointer transition-all"
            >
              <span className="text-sm font-black text-slate-900">Entrega</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Em casa</span>
            </Label>
          </div>
        </RadioGroup>
      </section>

      {/* 2. Endereço e Bairro (se entrega) */}
      {checkoutData.orderType === 'entrega' && (
        <section className="space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-2">
            <Label className="text-xs font-black text-slate-900 uppercase tracking-widest">Bairro de Entrega *</Label>
            {zones.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {zones.map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => handleZoneSelect(zone.id)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                      selectedZone?.id === zone.id 
                        ? "border-orange-500 bg-orange-50/50" 
                        : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <div>
                      <p className="font-black text-slate-900 text-sm">{zone.neighborhood}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                          <Clock className="w-3 h-3" /> {zone.estimatedTime || '--'}
                        </span>
                        {zone.minimumOrder && (
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                            <Info className="w-3 h-3" /> Min: R$ {zone.minimumOrder.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-black text-orange-600 text-sm">
                      {zone.deliveryFee === 0 ? 'Grátis' : `R$ ${zone.deliveryFee.toFixed(2).replace('.', ',')}`}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                <p className="text-xs font-bold text-slate-500">O lojista ainda não configurou taxas de entrega por bairro.</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-xs font-black text-slate-900 uppercase tracking-widest">Rua e Número *</Label>
            <Input 
              id="address"
              placeholder="Ex: Rua das Flores, 123"
              value={checkoutData.address}
              onChange={(e) => setCheckoutData({ address: e.target.value })}
              className="rounded-xl border-slate-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ref" className="text-xs font-black text-slate-900 uppercase tracking-widest">Referência</Label>
            <Input 
              id="ref"
              placeholder="Ex: Próximo ao mercado"
              value={checkoutData.referencePoint}
              onChange={(e) => setCheckoutData({ referencePoint: e.target.value })}
              className="rounded-xl border-slate-200"
            />
          </div>

          {selectedZone?.minimumOrder && subtotal < selectedZone.minimumOrder && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <Info className="w-4 h-4 text-red-500 mt-0.5" />
              <p className="text-xs font-bold text-red-600">
                O pedido mínimo para este bairro é R$ {selectedZone.minimumOrder.toFixed(2).replace('.', ',')}. 
                Faltam R$ {(selectedZone.minimumOrder - subtotal).toFixed(2).replace('.', ',')}.
              </p>
            </div>
          )}
        </section>
      )}

      {/* 3. Dados do Cliente */}
      <section className="space-y-4 pt-6 border-t border-slate-50">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Seus Dados</h3>
        <div className="grid grid-cols-1 gap-4">
          <Input 
            placeholder="Nome Completo *"
            value={checkoutData.customerName}
            onChange={(e) => setCheckoutData({ customerName: e.target.value })}
            className="rounded-xl border-slate-200"
          />
          <Input 
            placeholder="WhatsApp (DDD) *"
            value={checkoutData.customerPhone}
            onChange={(e) => setCheckoutData({ customerPhone: e.target.value })}
            className="rounded-xl border-slate-200"
          />
        </div>
      </section>

      {/* 4. Pagamento e Pix */}
      <section className="space-y-4 pt-6 border-t border-slate-50">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Forma de Pagamento</h3>
        <RadioGroup 
          value={checkoutData.paymentMethod} 
          onValueChange={(v) => setCheckoutData({ paymentMethod: v as any })}
          className="grid grid-cols-3 gap-2"
        >
          {['pix', 'dinheiro', 'cartao'].map((method) => (
            <div key={method}>
              <RadioGroupItem value={method} id={method} className="peer sr-only" />
              <Label
                htmlFor={method}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-100 bg-white p-3 hover:bg-slate-50 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50/50 cursor-pointer transition-all"
              >
                <span className="text-xs font-black text-slate-900 capitalize">{method === 'cartao' ? 'Cartão' : method}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {checkoutData.paymentMethod === 'pix' && merchant.pixConfig?.enabled && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Pagar via Pix Manual</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Chave Pix</p>
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-100">
                <span className="font-black text-slate-900 text-sm truncate mr-2">{merchant.pixConfig.key}</span>
                <Button size="icon" variant="ghost" onClick={handleCopyPix} className="h-8 w-8 text-emerald-600">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs font-bold text-emerald-800 leading-tight">
              Após enviar o pedido no WhatsApp, realize o Pix e envie o comprovante para o lojista confirmar seu pedido.
            </p>
          </div>
        )}
      </section>

      {/* 5. Resumo e Botão Final */}
      <section className="pt-6 border-t border-slate-100 space-y-4">
        <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
          <div className="flex justify-between text-sm font-bold text-slate-500">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-500">
            <span>Entrega ({checkoutData.orderType === 'entrega' ? selectedZone?.neighborhood || 'Não selecionado' : 'Retirada'})</span>
            <span>{deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}</span>
          </div>
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
            <span className="text-base font-black text-slate-900 uppercase tracking-tighter">Total</span>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        <Button 
          onClick={handleSendOrder}
          disabled={!isFormValid()}
          className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
        >
          <MessageCircle className="w-6 h-6 mr-2" />
          Enviar Pedido pelo WhatsApp
        </Button>
        <p className="text-[10px] text-center text-slate-400 font-bold px-4 leading-tight">
          O pedido será enviado como uma mensagem formatada. O lojista confirmará a disponibilidade e o prazo.
        </p>
      </section>
    </div>
  );
}
