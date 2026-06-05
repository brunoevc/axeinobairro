export type EconomicCategory = 'mercado' | 'farmacia' | 'restaurante' | 'oficina' | 'petshop' | 'saude' | 'outros';

export type Territory = 'Centro' | 'Pontinha' | 'Praia Seca' | 'Araruama' | 'Bananeiras' | 'Iguabinha';

export type PlanType = 'Gratuito' | 'Destaque' | 'Premium' | 'Patrocinador';

export type IntentSource = 'home' | 'planos' | 'negocios' | 'servicos' | 'transporte' | 'comunidades' | 'apoiadores';

export interface IntentEvent {
  type: 'click_plan' | 'view_business' | 'contact_click' | 'search';
  planId?: PlanType;
  category: EconomicCategory;
  territory: Territory;
  profile?: string;
  source: IntentSource;
  timestamp: number;
}

export type OpportunityScore = number;

export interface Opportunity {
  id: string;
  territory: Territory;
  category: EconomicCategory;
  suggestedPlan: PlanType;
  score: OpportunityScore;
  classification: 'Quente' | 'Morna' | 'Fria';
  lastActivity: number;
}
