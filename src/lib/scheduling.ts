import { Appointment, BusinessAvailability } from "@/types/scheduling";

const STORAGE_KEY = "axei_appointments";

export const getAppointments = (): Appointment[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveAppointments = (appointments: Appointment[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
};

export const createAppointment = (appointment: Omit<Appointment, "id" | "createdAt">): Appointment => {
  const appointments = getAppointments();
  
  // Basic conflict check
  const hasConflict = appointments.some(app => 
    app.merchantId === appointment.merchantId &&
    app.date === appointment.date &&
    app.startTime === appointment.startTime &&
    app.status !== "cancelled"
  );

  if (hasConflict) {
    throw new Error("Este horário já está ocupado.");
  }

  const newAppointment: Appointment = {
    ...appointment,
    id: `app_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };

  saveAppointments([...appointments, newAppointment]);
  return newAppointment;
};

export const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
  const appointments = getAppointments();
  const updated = appointments.map(app => 
    app.id === id ? { ...app, status } : app
  );
  saveAppointments(updated);
};

export const getMerchantAvailability = (merchantId: string): BusinessAvailability[] => {
  // Default mock availability: Mon-Fri, 09:00 - 18:00
  return [
    { dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isActive: true },
    { dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isActive: true },
    { dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isActive: true },
    { dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isActive: true },
    { dayOfWeek: 5, startTime: "09:00", endTime: "18:00", isActive: true },
  ];
};

export const generateTimeSlots = (date: string, duration: number = 60) => {
  const slots = [];
  let current = new Date(`${date}T09:00:00`);
  const end = new Date(`${date}T18:00:00`);

  while (current < end) {
    slots.push(current.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    current = new Date(current.getTime() + duration * 60000);
  }
  return slots;
};
