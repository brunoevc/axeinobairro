
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
import { Minus, Plus, Trash2, MessageCircle, AlertCircle } from "lucide-react";
import { getOrderWhatsAppUrl } from "@/lib/utils";
import { trackEvent } from "@/lib/metrics";
import { Textarea } from "@/components/ui/textarea";


interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  merchant?: Merchant;
}

export function CartDrawer({ isOpen, onClose, merchant }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotal, notes, setNotes, clearCart } = useCart();

  const total = getTotal();

  const handleSendOrder = () => {
    if (!merchant) return;
    
    trackEvent(merchant.id, "pedido_whatsapp", { estimatedValue: total });

    const url = getOrderWhatsAppUrl(merchant, items, notes);

    if (url) {
      window.open(url, '_blank');
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

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-2">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
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

              <div className="pt-6 border-t border-slate-50">
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 block">
                  Observações do Pedido
                </label>
                <Textarea 
                  placeholder="Ex: Tirar cebola, ponto da carne, etc..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-2xl border-slate-200 focus:ring-orange-500 min-h-[100px] text-sm font-medium"
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
              className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-100 transition-all active:scale-[0.98]"
              onClick={handleSendOrder}
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
