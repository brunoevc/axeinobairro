
export type Product = {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPromotion: boolean;
  isAvailable: boolean;
};

export const mockProducts: Product[] = [
  // Cantina da Nonna (merchantId: "1")
  {
    id: "p1",
    merchantId: "1",
    name: "Pizza Margherita",
    description: "Molho de tomate pelado, mozzarella de búfala e manjericão fresco.",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=400&q=80",
    category: "pizzas",
    isPromotion: false,
    isAvailable: true,
  },
  {
    id: "p2",
    merchantId: "1",
    name: "Lasanha à Bolonhesa",
    description: "Massa artesanal, ragu de carne bovina e molho bechamel.",
    price: 48.00,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80",
    category: "lanches",
    isPromotion: true,
    isAvailable: true,
  },
  {
    id: "p3",
    merchantId: "1",
    name: "Vinho Tinto da Casa",
    description: "Vinho tinto seco, seleção especial da Nonna.",
    price: 85.00,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80",
    category: "bebidas",
    isPromotion: false,
    isAvailable: true,
  },

  // Padaria Pão de Mel (merchantId: "2")
  {
    id: "p4",
    merchantId: "2",
    name: "Pão Francês (Unidade)",
    description: "Sempre quentinho e crocante.",
    price: 0.75,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    category: "padaria",
    isPromotion: false,
    isAvailable: true,
  },
  {
    id: "p5",
    merchantId: "2",
    name: "Bolo de Cenoura com Chocolate",
    description: "Bolo caseiro com cobertura generosa de chocolate.",
    price: 25.00,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
    category: "padaria",
    isPromotion: true,
    isAvailable: true,
  },

  // Hortifruti da Terra (merchantId: "6")
  {
    id: "p6",
    merchantId: "6",
    name: "Banana Prata (Kg)",
    description: "Bananas selecionadas e docinhas.",
    price: 6.90,
    image: "https://images.unsplash.com/photo-1571771894821-ad99024177c6?w=400&q=80",
    category: "hortifruti",
    isPromotion: false,
    isAvailable: true,
  },
  {
    id: "p7",
    merchantId: "6",
    name: "Tomate Italiano (Kg)",
    description: "Ideal para molhos e saladas.",
    price: 8.50,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80",
    category: "hortifruti",
    isPromotion: true,
    isAvailable: true,
  },

  // Peixaria Mar Azul (merchantId: "9")
  {
    id: "p8",
    merchantId: "9",
    name: "Filé de Tilápia (Kg)",
    description: "Peixe fresco e limpo, pronto para o preparo.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1534604973900-c41ab4c5e638?w=400&q=80",
    category: "peixes",
    isPromotion: true,
    isAvailable: true,
  },

  // PetShop Amigo Fiel (merchantId: "4")
  {
    id: "p9",
    merchantId: "4",
    name: "Ração Premium Cães Adultos 10kg",
    description: "Nutrição completa para o seu melhor amigo.",
    price: 189.90,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&q=80",
    category: "pet",
    isPromotion: false,
    isAvailable: true,
  },

  // Boutique Fashion (merchantId: "8")
  {
    id: "p10",
    merchantId: "8",
    name: "Camisa de Linho Masculina",
    description: "Conforto e estilo para os dias quentes.",
    price: 129.90,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
    category: "roupas",
    isPromotion: false,
    isAvailable: true,
  },
];

export const getProductsByMerchant = (merchantId: string): Product[] => {
  const customProducts = JSON.parse(localStorage.getItem("axei_products") || "[]");
  const filteredCustom = customProducts.filter((p: Product) => p.merchantId === merchantId);
  const filteredMock = mockProducts.filter((p: Product) => p.merchantId === merchantId);
  
  // Combine custom and mock, preferring custom if IDs overlap (though they shouldn't with p prefix)
  return [...filteredMock, ...filteredCustom];
};
