import { PixCharge, PixLink, TransactionStatus } from "@/types/payment";

const CHARGES_KEY = "axei_pix_charges";
const LINKS_KEY = "axei_pix_links";

export const paymentsRepository = {
  getCharges: (): PixCharge[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(CHARGES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveCharge: (charge: PixCharge) => {
    const charges = paymentsRepository.getCharges();
    localStorage.setItem(CHARGES_KEY, JSON.stringify([...charges, charge]));
  },

  updateChargeStatus: (id: string, status: TransactionStatus, receiptFilename?: string) => {
    const charges = paymentsRepository.getCharges();
    const updated = charges.map(c => 
      c.id === id ? { 
        ...c, 
        status, 
        receiptSentAt: status === "comprovante_enviado" ? new Date().toISOString() : c.receiptSentAt,
        receiptFilename: receiptFilename || c.receiptFilename
      } : c
    );
    localStorage.setItem(CHARGES_KEY, JSON.stringify(updated));
  },

  getLinks: (): PixLink[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(LINKS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveLink: (link: PixLink) => {
    const links = paymentsRepository.getLinks();
    localStorage.setItem(LINKS_KEY, JSON.stringify([...links, link]));
  }
};
