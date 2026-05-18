export type WidgetData = {
  id: string;
  type: "news" | "offers" | "events" | "services" | "pulse";
  title: string;
  value: string;
  icon: string;
  action: string;
};

export const mockWidgets: WidgetData[] = [
  { id: "1", type: "news", title: "Notícias", value: "Reforma na Praça Central começa amanhã", icon: "Newspaper", action: "Ler" },
  { id: "2", type: "offers", title: "Ofertas", value: "3 ofertas novas perto de você", icon: "Tag", action: "Ver" },
  { id: "3", type: "events", title: "Eventos", value: "Feira Orgânica neste sábado", icon: "Calendar", action: "Conferir" },
  { id: "4", type: "services", title: "Serviços", value: "Eletricista disponível agora", icon: "Wrench", action: "Chamar" },
];

export const neighborhoodPulse = {
  activeBusinesses: 142,
  newOffersToday: 12,
  trendingTopic: "Feira Orgânica",
  status: "Movimentado"
};
