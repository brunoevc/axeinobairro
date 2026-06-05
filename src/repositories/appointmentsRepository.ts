import { Appointment, AppointmentStatus } from "@/types/appointments";

const STORAGE_KEY = "axei_appointments";

export const appointmentsRepository = {
  getAll: (): Appointment[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getByMerchant: (merchantId: string): Appointment[] => {
    return appointmentsRepository.getAll().filter(a => a.merchantId === merchantId);
  },

  save: (appointment: Appointment) => {
    const data = appointmentsRepository.getAll();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...data, appointment]));
  },

  updateStatus: (id: string, status: AppointmentStatus) => {
    const data = appointmentsRepository.getAll();
    const updated = data.map(a => a.id === id ? { ...a, status } : a);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  delete: (id: string) => {
    const data = appointmentsRepository.getAll();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.filter(a => a.id !== id)));
  }
};
