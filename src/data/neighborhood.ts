import { 
  Sun, 
  Cloud, 
  Thermometer, 
  Newspaper, 
  Tag, 
  Calendar, 
  Wrench, 
  Sparkles, 
  Clock, 
  MapPin, 
  Search,
  MessageSquare,
  TrendingUp,
  Smile,
  Moon,
  Zap
} from "lucide-react";

export type WidgetType = 
  | "weather" 
  | "time" 
  | "news" 
  | "offers" 
  | "open" 
  | "events" 
  | "urgent" 
  | "ai_message" 
  | "mood" 
  | "horoscope" 
  | "pulse" 
  | "trending" 
  | "finds" 
  | "summary";

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  value: string;
  description?: string;
  iconName: string;
  actionLabel: string;
  color?: string;
  path: string;
}

export const mockWidgets: Widget[] = [
  {
    id: "w1",
    type: "weather",
    title: "Clima agora",
    value: "26°C",
    description: "Ensolarado",
    iconName: "Sun",
    actionLabel: "Ver detalhes",
    path: "/clima"
  },
  {
    id: "w2",
    type: "time",
    title: "Hora atual",
    value: "10:30",
    description: "Segunda-feira",
    iconName: "Clock",
    actionLabel: "Abrir",
    path: "/agenda"
  },
  {
    id: "w3",
    type: "news",
    title: "Notícias locais",
    value: "Reforma na Praça",
    description: "Começa amanhã",
    iconName: "Newspaper",
    actionLabel: "Ler mais",
    path: "/noticias"
  },
  {
    id: "w4",
    type: "offers",
    title: "Ofertas",
    value: "-20% no Zé",
    description: "Mercadinho do Zé",
    iconName: "Tag",
    actionLabel: "Aproveitar",
    path: "/ofertas"
  },
  {
    id: "w5",
    type: "open",
    title: "Aberto agora",
    value: "42 locais",
    description: "Comércios ativos",
    iconName: "Zap",
    actionLabel: "Ver todos",
    path: "/aberto-agora"
  },
  {
    id: "w6",
    type: "events",
    title: "Eventos",
    value: "Show na Vila",
    description: "Sábado, 20h",
    iconName: "Calendar",
    actionLabel: "Ingressos",
    path: "/eventos"
  },
  {
    id: "w7",
    type: "urgent",
    title: "Serviços urgentes",
    value: "Eletricista",
    description: "Disponível agora",
    iconName: "Wrench",
    actionLabel: "Chamar",
    path: "/servicos"
  },
  {
    id: "w8",
    type: "ai_message",
    title: "Dica do Dia",
    value: "Sorria!",
    description: "IA Motivacional",
    iconName: "Sparkles",
    actionLabel: "Ver mais",
    path: "/ia-assistente"
  },
  {
    id: "w9",
    type: "mood",
    title: "Humor do Bairro",
    value: "Radiante",
    description: "Povo feliz hoje",
    iconName: "Smile",
    actionLabel: "Votar",
    path: "/humor"
  },
  {
    id: "w10",
    type: "pulse",
    title: "Pulso do Bairro",
    value: "Ativo",
    description: "Status em tempo real",
    iconName: "TrendingUp",
    actionLabel: "Conferir",
    path: "/pulso"
  }
];

export const neighborhoodStatus = {
  name: "Vila Madalena",
  greeting: "Bom dia, João",
  status: "movimento alto",
  temp: "26°C"
};
