
import { MerchantAdmin, AdminState } from "@/data/admin";

const ADMIN_STATE_KEY = "axei-admin-state";

export type EventType = 
  | "view" 
  | "whatsapp" 
  | "instagram" 
  | "route" 
  | "share" 
  | "report" 
  | "search_appearance"
  | "product_added"
  | "pedido_whatsapp";


export const trackEvent = (merchantId: string, eventType: EventType) => {
  try {
    const stored = localStorage.getItem(ADMIN_STATE_KEY);
    if (!stored) return;

    const state: AdminState = JSON.parse(stored);
    const updatedMerchants = state.merchants.map((m: MerchantAdmin) => {
      if (m.id === merchantId) {
        const metrics = {
          views: m.views || 0,
          whatsappClicks: m.whatsappClicks || 0,
          instagramClicks: m.instagramClicks || 0,
          routeClicks: m.routeClicks || 0,
          shareClicks: m.shareClicks || 0,
          reportsCount: m.reportsCount || 0,
          searchAppearances: m.searchAppearances || 0,
          productAdded: m.productAdded || 0,
          pedidoWhatsapp: m.pedidoWhatsapp || 0,
        };


        switch (eventType) {
          case "view": metrics.views++; break;
          case "whatsapp": metrics.whatsappClicks++; break;
          case "instagram": metrics.instagramClicks++; break;
          case "route": metrics.routeClicks++; break;
          case "share": metrics.shareClicks++; break;
          case "report": metrics.reportsCount++; break;
          case "search_appearance": metrics.searchAppearances++; break;
          case "product_added": metrics.productAdded++; break;
          case "pedido_whatsapp": metrics.pedidoWhatsapp++; break;
        }


        return { ...m, ...metrics };
      }
      return m;
    });

    const newState = { 
      ...state, 
      merchants: updatedMerchants,
      lastUpdated: new Date().toISOString() 
    };
    localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(newState));
    
    // Dispatch a custom event so components can listen to changes if needed
    window.dispatchEvent(new CustomEvent('axei-metrics-updated', { detail: { merchantId, eventType } }));
  } catch (error) {
    console.error("Error tracking event:", error);
  }
};

export const getMerchantMetrics = (merchantId: string) => {
  try {
    const stored = localStorage.getItem(ADMIN_STATE_KEY);
    if (!stored) return null;

    const state: AdminState = JSON.parse(stored);
    const merchant = state.merchants.find((m: MerchantAdmin) => m.id === merchantId);
    
    if (!merchant) return null;

    return {
      views: merchant.views || 0,
      whatsappClicks: merchant.whatsappClicks || 0,
      instagramClicks: merchant.instagramClicks || 0,
      routeClicks: merchant.routeClicks || 0,
      shareClicks: merchant.shareClicks || 0,
      reportsCount: merchant.reportsCount || 0,
      searchAppearances: merchant.searchAppearances || 0,
    };
  } catch (error) {
    console.error("Error getting metrics:", error);
    return null;
  }
};
