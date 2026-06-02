
import { Lead, LeadStatus } from "@/types/leads";

const LEADS_KEY = "axei_leads";

export const getLeads = (): Lead[] => {
  const stored = localStorage.getItem(LEADS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveLeads = (leads: Lead[]) => {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
};

export const trackLead = (leadData: Omit<Lead, "id" | "status" | "createdAt" | "updatedAt">) => {
  const leads = getLeads();
  const newLead: Lead = {
    ...leadData,
    id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: "novo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  leads.push(newLead);
  saveLeads(leads);
  return newLead;
};

export const updateLead = (id: string, updates: Partial<Lead>) => {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index !== -1) {
    leads[index] = { ...leads[index], ...updates, updatedAt: new Date().toISOString() };
    saveLeads(leads);
    return leads[index];
  }
  return null;
};
