export type CRMStatus = "novo" | "contato_realizado" | "orcamento_enviado" | "agendado" | "concluido" | "cliente_recorrente";
export type Origin = "axei" | "indicacao" | "whatsapp" | "instagram" | "outro";

export interface Customer {
  id: string;
  merchantId: string;
  name: string;
  phone: string;
  bairro: string;
  service: string;
  origin: Origin;
  status: CRMStatus;
  notes?: string;
  createdAt: string;
}
