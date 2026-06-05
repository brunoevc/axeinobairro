import { IntentEvent, IntentSource, Territory, EconomicCategory, PlanType } from "@/types/business-intelligence";

const STORAGE_KEY = "axei_intent_events";

export const intentTracker = {
  track: (event: Omit<IntentEvent, 'timestamp'>) => {
    const events = intentTracker.getEvents();
    const newEvent: IntentEvent = {
      ...event,
      timestamp: Date.now()
    };
    events.push(newEvent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  },

  getEvents: (): IntentEvent[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  clearEvents: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
