import { PixCharge, TransactionStatus, PixLink } from "@/types/payment";
import { paymentsRepository } from "@/repositories/paymentsRepository";

export const getPixCharges = (): PixCharge[] => {
  return paymentsRepository.getCharges();
};

export const savePixCharges = (charges: PixCharge[]) => {
  // compatibility
  localStorage.setItem("axei_pix_charges", JSON.stringify(charges));
};

export const getPixLinks = (): PixLink[] => {
  return paymentsRepository.getLinks();
};

export const savePixLinks = (links: PixLink[]) => {
  // compatibility
  localStorage.setItem("axei_pix_links", JSON.stringify(links));
};


export const createPixCharge = (charge: Omit<PixCharge, "id" | "createdAt" | "expiresAt" | "pixKey">): PixCharge => {
  const id = `charge_${Math.random().toString(36).substr(2, 9)}`;

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
  const links = paymentsRepository.getLinks();

  if (links.length >= 20) throw new Error("Limite de links atingido");
  const id = `link_${Math.random().toString(36).substr(2, 9)}`;
  const newLink: PixLink = {
    ...link,
    id,
    active: true,
    createdAt: new Date().toISOString()
  };
  paymentsRepository.saveLink(newLink);
  return newLink;
};
