
export type CampaignStatus = "ativa" | "encerrada" | "agendada";
export type CampaignTarget = "todos" | "bairro" | "categoria" | "leads";
export type CampaignChannel = "painel" | "push_mock" | "whatsapp_manual";

export interface Campaign {
  id: string;
  merchantId: string;
  merchantName: string;
  title: string;
  message: string;
  target: CampaignTarget;
  targetValue?: string; // Bairro ou categoria específica
  channel: CampaignChannel;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  createdAt: string;
  stats: {
    impacted: number;
    clicks: number;
    responses: number;
    conversions: number;
  };
}
