import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Merchant } from "@/data/merchants";
import { Minus, Plus, Trash2, MessageCircle, AlertCircle, User, Phone, MapPin, CreditCard, ClipboardList, Info } from "lucide-react";
import { getOrderWhatsAppUrl } from "@/lib/utils";
import { trackEvent } from "@/lib/metrics";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { LocalCheckout } from "./LocalCheckout";
import { useState } from "react";


interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  merchant?: Merchant;
}

export function CartDrawer({ isOpen, onClose, merchant }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotal, notes, setNotes, clearCart, checkoutData, setCheckoutData, updateItemNote } = useCart();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  const total = getTotal();

  const handleSendOrder = () => {
    // This is now handled by LocalCheckout
  };


  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full border-l-0 sm:border-l">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="text-xl font-black text-slate-900 flex items-center justify-between">
            Seu Pedido
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-xs font-bold text-slate-400 hover:text-red-500">
              Limpar
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <p className="font-black text-slate-900">Carrinho vazio</p>
                <p className="text-sm text-slate-500 font-medium">Adicione produtos da loja para começar seu pedido.</p>
              </div>
            </div>
          ) : (
            <>
              {step === 'cart' ? (
                <>
                  {/* ITENS DO CARRINHO */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-orange-500" />
                      Itens Selecionados
                    </h3>
                    {items.map((item) => (
                      <div key={item.id} className="space-y-3 py-4 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-black text-slate-900 line-clamp-1">{item.name}</h4>
                            <p className="text-xs font-bold text-orange-600">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-100">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-black text-slate-900 min-w-[20px] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Info className="w-3 h-3 text-slate-400" />
                          <Input 
                            placeholder="Obs: Sem cebola, gelado..."
                            value={item.itemNote || ''}
                            onChange={(e) => updateItemNote(item.id, e.target.value)}
                            className="h-8 text-[11px] font-medium border-slate-100 rounded-lg focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* OBSERVAÇÕES DO PEDIDO */}
                  <div className="pt-6 border-t border-slate-50">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 block">
                      Instruções Gerais do Pedido
                    </label>
                    <Textarea 
                      placeholder="Ex: Tocar a campainha com força, deixar na portaria..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="rounded-2xl border-slate-200 focus:ring-orange-500 min-h-[80px] text-sm font-medium"
                    />
                  </div>

                  <div className="pt-6 border-t border-slate-50">
                    <div className="flex items-center justify-between w-full mb-6">
                      <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Subtotal</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tighter">
                        R$ {total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <Button 
                      onClick={() => setStep('checkout')}
                      className="w-full h-16 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-lg shadow-xl shadow-orange-100 transition-all active:scale-[0.98]"
                    >
                      Continuar para entrega
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setStep('cart')}
                    className="text-xs font-black text-slate-400 uppercase tracking-widest p-0 h-auto hover:text-orange-600 mb-2"
                  >
                    ← Voltar ao carrinho
                  </Button>
                  {merchant && <LocalCheckout merchant={merchant} onSuccess={onClose} />}
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

