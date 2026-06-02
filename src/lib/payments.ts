import { PixCharge, TransactionStatus } from "@/types/payment";

const STORAGE_KEY = "axei_pix_charges";

export const getPixCharges = (): PixCharge[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savePixCharges = (charges: PixCharge[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(charges));
};

export const createPixCharge = (charge: Omit<PixCharge, "id" | "createdAt" | "expiresAt" | "pixKey">): PixCharge => {
  const charges = getPixCharges();
  const id = `charge_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  const expires = new Date(now.getTime() + 60 * 60000); // 1 hour expiry for manual flow

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

export const getPixChargeById = (id: string): PixCharge | undefined => {
  return getPixCharges().find(c => c.id === id);
};

export const updatePixStatus = (id: string, status: TransactionStatus) => {
  const charges = getPixCharges();
  const updated = charges.map(c => 
    c.id === id ? { 
      ...c, 
      status, 
      receiptSentAt: status === "comprovante_enviado" ? new Date().toISOString() : c.receiptSentAt 
    } : c
  );
  savePixCharges(updated);
};
