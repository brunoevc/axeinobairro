import { MerchantAdmin, AdminState } from "@/data/admin";
import { trackLead } from "@/lib/leads";
import { supabase } from "@/integrations/supabase/client";

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
  | "pedido_whatsapp"
  | "promocao";


interface TrackEventMetadata {
  estimatedValue?: number;
  neighborhood?: string;
}

export const trackEvent = async (entityId: string, eventType: EventType, metadata?: TrackEventMetadata) => {
  try {
    // 1. Legacy LocalStorage Tracking (Keep for existing Admin Dashboard compatibility)
    const stored = localStorage.getItem(ADMIN_STATE_KEY);
    if (stored) {
      const state: AdminState = JSON.parse(stored);
      const updatedMerchants = state.merchants.map((m: MerchantAdmin) => {
        if (m.id === entityId) {
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
            case "promocao": break;
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
    }

    // 2. Real-time Supabase Tracking (New Phase 12.0A)
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('metrics_events').insert({
      user_id: user?.id,
      event_type: eventType,
      entity_type: 'merchant', // Default for this function's typical usage
      entity_id: entityId,
      neighborhood: metadata?.neighborhood,
      metadata: metadata || {},
    });

    // 3. Lead Tracking Integration
    if (eventType === "whatsapp") {
      trackLead({ merchantId: entityId, customerName: "Interessado no WhatsApp", customerPhone: "Não informado", source: "whatsapp" });
    } else if (eventType === "pedido_whatsapp") {
      trackLead({ 
        merchantId: entityId, 
        customerName: "Cliente de Pedido", 
        customerPhone: "Não informado", 
        source: "order",
        estimatedValue: metadata?.estimatedValue,
        checkoutData: (metadata as any)?.checkoutData
      });
    }

    window.dispatchEvent(new CustomEvent('axei-metrics-updated', { detail: { entityId, eventType } }));
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
