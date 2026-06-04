import { Review } from "@/types/reviews";

export const mockReviews: Review[] = [
  {
    id: "r1",
    targetId: "1", // João Eletricista
    targetType: "servico",
    authorName: "Carlos Oliveira",
    rating: 5,
    comment: "Excelente profissional. Resolveu o problema da fiação em tempo recorde e o preço foi justo.",
    createdAt: "2026-05-15T10:30:00Z",
    isVisible: true
  },
  {
    id: "r2",
    targetId: "1", // João Eletricista
    targetType: "servico",
    authorName: "Ana Souza",
    rating: 4,
    comment: "Gostei muito do atendimento. Foi pontual e explicou tudo o que estava fazendo.",
    createdAt: "2026-05-20T14:45:00Z",
    isVisible: true
  },
  {
    id: "r3",
    targetId: "m1", // Supondo ID de loja
    targetType: "loja",
    authorName: "Roberto Santos",
    rating: 5,
    comment: "Melhores produtos da região. O atendimento via WhatsApp é muito rápido.",
    createdAt: "2026-05-25T16:20:00Z",
    isVisible: true
  },
  {
    id: "r4",
    targetId: "1", // João Silva (Transporte)
    targetType: "transporte",
    authorName: "Lúcia Ferreira",
    rating: 5,
    comment: "Motorista muito educado e carro limpo. Chegou no horário combinado.",
    createdAt: "2026-05-28T08:15:00Z",
    isVisible: true
  },
  {
    id: "r5",
    targetId: "2", // Maria Diarista
    targetType: "servico",
    authorName: "Teste Oculto",
    rating: 1,
    comment: "Este comentário deve estar oculto por padrão no público.",
    createdAt: "2026-06-01T12:00:00Z",
    isVisible: false
  }
];
