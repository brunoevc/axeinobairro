
export type LeadStatus = "novo" | "em_atendimento" | "interessado" | "cliente" | "perdido";

export type Lead = {
  id: string;
  merchantId: string;
  customerName: string;
  customerPhone: string;
  source: "whatsapp" | "pedido" | "share" | "promocao" | "order";
  status: LeadStatus;
  notes?: string;
  estimatedValue?: number;
  createdAt: string;
  updatedAt: string;
  checkoutData?: any;
};
