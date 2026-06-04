import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Merchant } from "@/data/merchants";
import { CartItem, CheckoutData } from "@/hooks/useCart";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getWhatsAppUrl = (phone: string, merchantName: string) => {
  if (!phone) return null;
  const cleanPhone = phone.replace(/\D/g, "");
  if (!cleanPhone || cleanPhone.length < 8) return null;
  const formattedPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
  const message = `Olá! Vi a loja ${merchantName} no Axêi no Bairro e gostaria de mais informações.`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};

export const getOrderWhatsAppUrl = (
  merchant: Merchant, 
  cartItems: CartItem[], 
  notes: string,
  checkoutData: CheckoutData
) => {
  if (!merchant.whatsapp) return null;
  const cleanPhone = merchant.whatsapp.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
  
  const itemsText = cartItems.map(item => 
    `• ${item.quantity}x ${item.name} — R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}${item.itemNote ? `\n  Obs: ${item.itemNote}` : ''}`
  ).join('\n');
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = checkoutData.orderType === 'entrega' ? (checkoutData.deliveryFee || 0) : 0;
  const total = subtotal + deliveryFee;
  
  const formattedSubtotal = subtotal.toFixed(2).replace('.', ',');
  const formattedDelivery = deliveryFee.toFixed(2).replace('.', ',');
  const formattedTotal = total.toFixed(2).replace('.', ',');

  
  let message = `Olá! Vim pelo Axêi no Bairro e gostaria de fazer este pedido.\n\n`;
  
  message += `🛒 ITENS:\n${itemsText}\n\n`;
  
  message += `💰 RESUMO DO PEDIDO:\nSubtotal: R$ ${formattedSubtotal}\nEntrega: R$ ${formattedDelivery}\nTOTAL: R$ ${formattedTotal}\n\n`;
  
  message += `👤 Cliente:\nNome: ${checkoutData.customerName}\nTelefone: ${checkoutData.customerPhone}\n\n`;
  
  const orderTypeLabel = checkoutData.orderType === 'entrega' ? 'Entrega' : 'Retirada';
  message += `🚚 Tipo de pedido:\n${orderTypeLabel}\n\n`;
  
  if (checkoutData.orderType === 'entrega') {
    message += `📍 Endereço de entrega:\nRua: ${checkoutData.address}\nBairro: ${checkoutData.neighborhood}\n`;
    if (checkoutData.referencePoint) {
      message += `Referência: ${checkoutData.referencePoint}\n`;
    }
    if (checkoutData.deliveryLocationShared) {
      message += `(Localização via GPS enviada abaixo)\n`;
    }
    message += `\n`;
  }
  
  const paymentLabels = {
    pix: 'Pix',
    dinheiro: 'Dinheiro',
    cartao: 'Cartão'
  };
  message += `💳 Forma de pagamento:\n${paymentLabels[checkoutData.paymentMethod]}\n\n`;
  
  if (checkoutData.paymentMethod === 'dinheiro' && checkoutData.changeFor) {
    message += `💵 Troco:\nTroco para R$ ${checkoutData.changeFor}\n\n`;
  }
  
  if (checkoutData.paymentMethod === 'pix') {
    if (merchant.pixConfig?.enabled) {
      message += `📲 Pix Disponível:\nChave: ${merchant.pixConfig.key}\nTitular: ${merchant.pixConfig.holderName}\n\n`;
    } else {
      message += `📲 Pix:\nPor favor, envie a chave Pix para pagamento. Enviarei o comprovante após realizar o pagamento.\n\n`;
    }


  }
  
  if (notes) {
    message += `📝 Observações:\n${notes}\n\n`;
  }
  
  message += `Aguardar confirmação de disponibilidade, entrega, prazo e forma de pagamento.`;
  
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};
