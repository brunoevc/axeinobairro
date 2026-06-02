
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
import { Minus, Plus, Trash2, MessageCircle, AlertCircle, User, Phone, MapPin, CreditCard, ClipboardList } from "lucide-react";
import { getOrderWhatsAppUrl } from "@/lib/utils";
import { trackEvent } from "@/lib/metrics";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  merchant?: Merchant;
}

export function CartDrawer({ isOpen, onClose, merchant }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotal, notes, setNotes, clearCart, checkoutData, setCheckoutData } = useCart();

  const total = getTotal();

  const isFormValid = () => {
    if (!checkoutData.customerName || !checkoutData.customerPhone) return false;
    if (checkoutData.orderType === 'entrega') {
      if (!checkoutData.address || !checkoutData.neighborhood) return false;
    }
    return true;
  };

  const handleSendOrder = () => {
    if (!merchant) return;
    
    if (!isFormValid()) {
      toast.error("Por favor, preencha os campos obrigatórios");
      return;
    }

    trackEvent(merchant.id, "pedido_whatsapp", { 
      estimatedValue: total,
      checkoutData 
    } as any);

    const url = getOrderWhatsAppUrl(merchant, items, notes, checkoutData);

    if (url) {
      window.open(url, '_blank');
      toast.success("Pedido pronto para envio no WhatsApp");
    }
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
              {/* ITENS DO CARRINHO */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-orange-500" />
                  Itens Selecionados
                </h3>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-2">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
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
                ))}
              </div>

              {/* DADOS DO CLIENTE */}
              <div className="space-y-4 pt-6 border-t border-slate-50">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500" />
                  Seus Dados
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="text-xs font-bold text-slate-500">Nome completo *</Label>
                    <Input 
                      id="customerName"
                      placeholder="Como podemos te chamar?"
                      value={checkoutData.customerName}
                      onChange={(e) => setCheckoutData({ customerName: e.target.value })}
                      className="rounded-xl border-slate-200 focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone" className="text-xs font-bold text-slate-500">WhatsApp *</Label>
                    <Input 
                      id="customerPhone"
                      placeholder="(00) 00000-0000"
                      value={checkoutData.customerPhone}
                      onChange={(e) => setCheckoutData({ customerPhone: e.target.value })}
                      className="rounded-xl border-slate-200 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* TIPO DE PEDIDO */}
              <div className="space-y-4 pt-6 border-t border-slate-50">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  Como deseja receber?
                </h3>
                <RadioGroup 
                  value={checkoutData.orderType} 
                  onValueChange={(v) => setCheckoutData({ orderType: v as any })}
                  className="flex gap-4"
                >
                  <div className="flex-1">
                    <RadioGroupItem value="retirada" id="retirada" className="peer sr-only" />
                    <Label
                      htmlFor="retirada"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50/50 cursor-pointer transition-all"
                    >
                      <span className="text-sm font-black text-slate-900">Retirada</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Vou buscar</span>
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem value="entrega" id="entrega" className="peer sr-only" />
                    <Label
                      htmlFor="entrega"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50/50 cursor-pointer transition-all"
                    >
                      <span className="text-sm font-black text-slate-900">Entrega</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Em casa</span>
                    </Label>
                  </div>
                </RadioGroup>

                {checkoutData.orderType === 'entrega' && (
                  <div className="grid grid-cols-1 gap-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-xs font-bold text-slate-500">Rua e número *</Label>
                      <Input 
                        id="address"
                        placeholder="Ex: Rua das Flores, 123"
                        value={checkoutData.address}
                        onChange={(e) => setCheckoutData({ address: e.target.value })}
                        className="rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood" className="text-xs font-bold text-slate-500">Bairro *</Label>
                      <Input 
                        id="neighborhood"
                        placeholder="Ex: Centro"
                        value={checkoutData.neighborhood}
                        onChange={(e) => setCheckoutData({ neighborhood: e.target.value })}
                        className="rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reference" className="text-xs font-bold text-slate-500">Referência</Label>
                      <Input 
                        id="reference"
                        placeholder="Ex: Próximo ao mercado"
                        value={checkoutData.referencePoint}
                        onChange={(e) => setCheckoutData({ referencePoint: e.target.value })}
                        className="rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PAGAMENTO */}
              <div className="space-y-4 pt-6 border-t border-slate-50">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-500" />
                  Forma de Pagamento
                </h3>
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

                {checkoutData.paymentMethod === 'dinheiro' && (
                  <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="change" className="text-xs font-bold text-slate-500">Troco para quanto?</Label>
                    <Input 
                      id="change"
                      placeholder="Ex: 50,00"
                      value={checkoutData.changeFor}
                      onChange={(e) => setCheckoutData({ changeFor: e.target.value })}
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                )}

                {checkoutData.paymentMethod === 'pix' && (
                  <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id="pixInstruction" 
                        checked={checkoutData.pixReceiptInstruction}
                        onCheckedChange={(checked) => setCheckoutData({ pixReceiptInstruction: !!checked })}
                        className="mt-1 border-orange-300 data-[state=checked]:bg-orange-500"
                      />
                      <Label htmlFor="pixInstruction" className="text-xs font-medium text-slate-600 leading-relaxed cursor-pointer">
                        Estou ciente que devo solicitar a chave Pix e enviar o comprovante após o pagamento.
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              {/* OBSERVAÇÕES */}
              <div className="pt-6 border-t border-slate-50">
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 block">
                  Observações Adicionais
                </label>
                <Textarea 
                  placeholder="Ex: Tirar cebola, ponto da carne, campainha com defeito..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-2xl border-slate-200 focus:ring-orange-500 min-h-[80px] text-sm font-medium"
                />
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-6 border-t bg-slate-50 mt-auto flex-col space-y-4 sm:flex-col">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Estimado</span>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            <Button 
              className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
              onClick={handleSendOrder}
              disabled={!isFormValid()}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Enviar pedido pelo WhatsApp
            </Button>
            
            <p className="text-[10px] text-center text-slate-400 font-bold px-4 leading-tight">
              O pagamento e a entrega serão combinados diretamente com a loja via WhatsApp.
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
