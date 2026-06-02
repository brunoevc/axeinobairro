export type TransactionStatus = 
  | "aguardando_pagamento" 
  | "comprovante_enviado" 
  | "aprovado" 
  | "recusado" 
  | "cancelado";

export interface PixPurpose {
  id: string;
  name: string;
  description?: string;
  fixedAmount?: number;
  allowFreeValue: boolean;
}

export interface PixLink {
  id: string;
  merchantId: string;
  merchantName: string;
  title: string;
  purposes: PixPurpose[];
  active: boolean;
  createdAt: string;
}

export interface PixCharge {
  id: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  customerName: string;
  description?: string;
  status: TransactionStatus;
  pixKey: string;
  createdAt: string;
  expiresAt: string;
  receiptSentAt?: string;
  purposeName?: string;
  receiptFilename?: string;
  linkId?: string;
}
