export type TransactionStatus = 
  | "aguardando_pagamento" 
  | "comprovante_enviado" 
  | "aprovado" 
  | "recusado" 
  | "cancelado";

export interface PixCharge {
  id: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  customerName: string;
  description?: string;
  status: TransactionStatus;
  pixKey: string; // Mock key
  createdAt: string;
  expiresAt: string;
  receiptSentAt?: string;
}
