import { PixConfig } from "./users";

export type Representative = {
  id: string;
  name: string;
  role: string;
  city: string;
  neighborhood?: string;
  phone: string;
  whatsapp: string;
  photo?: string;
  description: string;
  isActive: boolean;
  pixConfig?: PixConfig;
  createdAt: string;
  updatedAt: string;
};
