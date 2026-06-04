import { User } from "@/types/users";
import { storage } from "./storage";

const STORAGE_KEY = "axei_users";

const defaultUsers: User[] = [
  {
    id: "user-1",
    name: "Bruno E.",
    email: "brunoevc@gmail.com",
    role: "master_admin",
    password: "123",
    neighborhood: "Centro",
    interests: ["negocios", "noticias", "transporte"],
    mustChangePassword: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user-2",
    name: "Maria Santos",
    email: "maria@exemplo.com",
    role: "morador",
    password: "123",
    neighborhood: "Vila Nova",
    interests: ["eventos_religiosos", "noticias", "servicos"],
    faithCommunity: "Igreja Matriz de Araruama",
    mustChangePassword: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user-3",
    name: "João Silva",
    email: "lider@comunidade.com",
    role: "lider_comunidade",
    password: "123",
    neighborhood: "Centro",
    faithCommunity: "Igreja Matriz de Araruama",
    mustChangePassword: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];


// Garantir que a senha inicial do prompt seja respeitada se não houver no storage
const initialPassword = "123456";
defaultUsers[0].password = initialPassword;

export const usersRepository = {
  getAll: (): User[] => {
    return storage.get(STORAGE_KEY, defaultUsers);
  },

  getByEmail: (email: string): User | undefined => {
    return usersRepository.getAll().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  save: (user: User) => {
    const users = usersRepository.getAll();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      users.push({ ...user, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    storage.set(STORAGE_KEY, users);
  }
};
