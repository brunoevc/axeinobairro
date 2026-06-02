import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Merchant } from "@/data/merchants";
import { CartItem } from "@/hooks/useCart";

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

export const getOrderWhatsAppUrl = (merchant: Merchant, cartItems: CartItem[], notes: string) => {
  if (!merchant.whatsapp) return null;
  const cleanPhone = merchant.whatsapp.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
  
  const itemsText = cartItems.map(item => 
    `- ${item.quantity}x ${item.name} — R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`
  ).join('\n');
  
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let message = `Olá! Vim pelo Axêi no Bairro e gostaria de fazer este pedido:\n\n`;
  message += `*Itens:*\n${itemsText}\n\n`;
  
  if (notes) {
    message += `*Observação:*\n${notes}\n\n`;
  }
  
  message += `*Total estimado: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
  message += `Aguardar confirmação de disponibilidade, entrega e forma de pagamento.`;
  
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};




