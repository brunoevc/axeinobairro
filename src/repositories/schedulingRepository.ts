import { Appointment } from "@/types/scheduling";

const STORAGE_KEY = "axei_appointments";

export const schedulingRepository = {
  getAll: (): Appointment[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  save: (appointment: Appointment) => {
    const appointments = schedulingRepository.getAll();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...appointments, appointment]));
  },

  updateStatus: (id: string, status: Appointment["status"]) => {
    const appointments = schedulingRepository.getAll();
    const updated = appointments.map(app => 
      app.id === id ? { ...app, status } : app
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
