import { toast } from "sonner";

export const validatePixKey = (type: string, key: string): boolean => {
  if (!key) return false;
  
  // Validação simples para mock
  switch (type) {
    case 'cpf':
      return /^\d{11}$/.test(key.replace(/\D/g, ''));
    case 'cnpj':
      return /^\d{14}$/.test(key.replace(/\D/g, ''));
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key);
    case 'phone':
      return /^\d{10,11}$/.test(key.replace(/\D/g, ''));
    default:
      return key.length > 5;
  }
};

export const formatPixKeyLabel = (type: string): string => {
  switch (type) {
    case 'cpf': return 'CPF';
    case 'cnpj': return 'CNPJ';
    case 'email': return 'E-mail';
    case 'phone': return 'Telefone';
    case 'random': return 'Chave Aleatória';
    default: return 'Chave';
  }
};

export const copyPixKey = async (key: string) => {
  try {
    await navigator.clipboard.writeText(key);
    toast.success("Chave Pix copiada!");
    return true;
  } catch (err) {
    toast.error("Erro ao copiar chave.");
    return false;
  }
};
