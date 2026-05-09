export type Merchant = {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  neighborhood: string;
  isOpen: boolean;
  delivery: boolean;
  rating: number;
  description: string;
  whatsapp: string; // E.164 without +
  featured?: boolean;
  isNew?: boolean;
  emoji: string;
};

export const categories = [
  { slug: "all", label: "Todos", icon: "Sparkles" },
  { slug: "restaurantes", label: "Restaurantes", icon: "UtensilsCrossed" },
  { slug: "mercados", label: "Mercados", icon: "ShoppingBasket" },
  { slug: "padarias", label: "Padarias", icon: "Croissant" },
  { slug: "farmacias", label: "Farmácias", icon: "Pill" },
  { slug: "beleza", label: "Beleza", icon: "Scissors" },
  { slug: "servicos", label: "Serviços", icon: "Wrench" },
  { slug: "pet", label: "Pet", icon: "PawPrint" },
] as const;

export const neighborhoods = [
  "Todos os bairros",
  "Centro",
  "Jardim das Flores",
  "Vila Nova",
  "Boa Vista",
  "São José",
  "Parque Industrial",
];

export const merchants: Merchant[] = [
  {
    id: "1",
    name: "Cantina da Nonna",
    category: "restaurantes",
    categoryIcon: "UtensilsCrossed",
    neighborhood: "Centro",
    isOpen: true,
    delivery: true,
    rating: 4.9,
    description: "Massas artesanais e pizzas de forno a lenha.",
    whatsapp: "5511999990001",
    featured: true,
    emoji: "🍝",
  },
  {
    id: "2",
    name: "Mercadinho do Zé",
    category: "mercados",
    categoryIcon: "ShoppingBasket",
    neighborhood: "Vila Nova",
    isOpen: true,
    delivery: true,
    rating: 4.7,
    description: "Hortifruti fresco e produtos do dia a dia.",
    whatsapp: "5511999990002",
    featured: true,
    emoji: "🛒",
  },
  {
    id: "3",
    name: "Padaria Pão Quente",
    category: "padarias",
    categoryIcon: "Croissant",
    neighborhood: "Jardim das Flores",
    isOpen: true,
    delivery: false,
    rating: 4.8,
    description: "Pães, bolos e cafés saindo do forno toda hora.",
    whatsapp: "5511999990003",
    emoji: "🥐",
  },
  {
    id: "4",
    name: "Farmácia Saúde+",
    category: "farmacias",
    categoryIcon: "Pill",
    neighborhood: "Centro",
    isOpen: true,
    delivery: true,
    rating: 4.6,
    description: "Entrega rápida de medicamentos no bairro.",
    whatsapp: "5511999990004",
    emoji: "💊",
  },
  {
    id: "5",
    name: "Studio Bella Hair",
    category: "beleza",
    categoryIcon: "Scissors",
    neighborhood: "Boa Vista",
    isOpen: false,
    delivery: false,
    rating: 4.9,
    description: "Cortes, coloração e tratamentos capilares.",
    whatsapp: "5511999990005",
    isNew: true,
    emoji: "💇",
  },
  {
    id: "6",
    name: "Tio João Encanador",
    category: "servicos",
    categoryIcon: "Wrench",
    neighborhood: "São José",
    isOpen: true,
    delivery: false,
    rating: 4.8,
    description: "Reparos hidráulicos com atendimento no mesmo dia.",
    whatsapp: "5511999990006",
    emoji: "🔧",
  },
  {
    id: "7",
    name: "PetShop Amigo Fiel",
    category: "pet",
    categoryIcon: "PawPrint",
    neighborhood: "Jardim das Flores",
    isOpen: true,
    delivery: true,
    rating: 4.7,
    description: "Banho, tosa e ração com entrega no bairro.",
    whatsapp: "5511999990007",
    isNew: true,
    emoji: "🐾",
  },
  {
    id: "8",
    name: "Hamburgueria Brasa",
    category: "restaurantes",
    categoryIcon: "UtensilsCrossed",
    neighborhood: "Vila Nova",
    isOpen: true,
    delivery: true,
    rating: 4.8,
    description: "Smash burgers artesanais e batatas crocantes.",
    whatsapp: "5511999990008",
    featured: true,
    emoji: "🍔",
  },
  {
    id: "9",
    name: "Açaí da Praça",
    category: "restaurantes",
    categoryIcon: "UtensilsCrossed",
    neighborhood: "Centro",
    isOpen: true,
    delivery: true,
    rating: 4.6,
    description: "Açaí cremoso com frutas e complementos.",
    whatsapp: "5511999990009",
    isNew: true,
    emoji: "🍧",
  },
];
