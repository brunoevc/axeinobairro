import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getWhatsAppUrl = (phone: string, merchantName: string) => {
  const cleanPhone = phone.replace(/\D/g, "");
  if (!cleanPhone) return null;
  const formattedPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
  const message = "Olá! Vi sua loja no Axêi no Bairro e gostaria de mais informações.";
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
};


