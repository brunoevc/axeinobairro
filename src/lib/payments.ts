import { PixCharge, TransactionStatus, PixLink } from "@/types/payment";

const STORAGE_KEY = "axei_pix_charges";
const LINKS_KEY = "axei_pix_links";

export const getPixCharges = (): PixCharge[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savePixCharges = (charges: PixCharge[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(charges));
};

export const getPixLinks = (): PixLink[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LINKS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savePixLinks = (links: PixLink[]) => {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
};

export const createPixCharge = (charge: Omit<PixCharge, "id" | "createdAt" | "expiresAt" | "pixKey">): PixCharge => {
  const charges = getPixCharges();
  const id = `charge_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  const expires = new Date(now.getTime() + 60 * 60000);

  const newCharge: PixCharge = {
    ...charge,
    id,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    pixKey: "00020126330014BR.GOV.BCB.PIX0111MOCKKEY1235204000053039865802BR5913AXEI_SIMULADO6008ARARUAMA62070503***6304E2D5",
  };

  savePixCharges([...charges, newCharge]);
  return newCharge;
};

export const updatePixStatus = (id: string, status: TransactionStatus, receiptFilename?: string) => {
  const charges = getPixCharges();
  const updated = charges.map(c => 
    c.id === id ? { 
      ...c, 
      status, 
      receiptSentAt: status === "comprovante_enviado" ? new Date().toISOString() : c.receiptSentAt,
      receiptFilename: receiptFilename || c.receiptFilename
    } : c
  );
  savePixCharges(updated);
};

export const getPixChargeById = (id: string): PixCharge | undefined => {
  return getPixCharges().find(c => c.id === id);
};

export const cancelPixCharge = (id: string) => {
  updatePixStatus(id, "cancelado");
};

export const getPixLinkById = (id: string): PixLink | undefined => {
  return getPixLinks().find(l => l.id === id);
};

export const createPixLink = (link: Omit<PixLink, "id" | "createdAt" | "active">): PixLink => {
  const links = getPixLinks();
  if (links.length >= 20) throw new Error("Limite de links atingido");
  const id = `link_${Math.random().toString(36).substr(2, 9)}`;
  const newLink: PixLink = {
    ...link,
    id,
    active: true,
    createdAt: new Date().toISOString()
  };
  savePixLinks([...links, newLink]);
  return newLink;
};
