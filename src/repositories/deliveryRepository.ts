import { DeliveryZone } from "@/types/delivery";

const STORAGE_KEY = "axei_delivery_zones";

export const deliveryRepository = {
  getAll: (): DeliveryZone[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  getByMerchant: (merchantId: string): DeliveryZone[] => {
    return deliveryRepository.getAll().filter(zone => zone.merchantId === merchantId);
  },

  save: (zone: DeliveryZone) => {
    const zones = deliveryRepository.getAll();
    const index = zones.findIndex(z => z.id === zone.id);
    if (index !== -1) {
      zones[index] = zone;
    } else {
      zones.push(zone);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
  },

  delete: (id: string) => {
    const zones = deliveryRepository.getAll().filter(z => z.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
  }
};
